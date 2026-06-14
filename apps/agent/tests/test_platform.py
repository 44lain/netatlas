from netatlas.models import DeviceResult, PortResult, ScanResult
from netatlas.platform import _device_to_api


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
