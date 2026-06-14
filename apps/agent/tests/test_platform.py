from netatlas.models import DeviceResult, PortResult, ScanResult
from netatlas.platform import PlatformError, _device_to_api, _request
import pytest


def test_device_to_api_payload() -> None:
    device = DeviceResult(
        ip="10.0.0.1",
        hostname="gw",
        mac_address="AA:BB:CC:DD:EE:FF",
        vendor="Test",
        status="online",
        ports=[PortResult(443, "tcp", "https", "open")],
    )
    payload = _device_to_api(device)
    assert payload["ip"] == "10.0.0.1"
    assert payload["ports"][0]["port_number"] == 443


def test_scan_result_structure() -> None:
    result = ScanResult(network="10.0.0.0/24", devices=[], duration_seconds=1.0)
    assert result.to_dict()["network"] == "10.0.0.0/24"


def test_request_invalid_json_raises_platform_error(monkeypatch) -> None:
    class FakeResponse:
        def read(self) -> bytes:
            return b"<html>login</html>"

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    def fake_urlopen(req, timeout=120):
        return FakeResponse()

    monkeypatch.setattr("urllib.request.urlopen", fake_urlopen)

    with pytest.raises(PlatformError, match="esperado JSON"):
        _request("GET", "https://example.com/api/health", token=None)
