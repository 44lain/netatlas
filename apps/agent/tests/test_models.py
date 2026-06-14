from netatlas.models import DeviceResult, PortResult, ScanResult


def test_scan_result_to_dict() -> None:
    result = ScanResult(
        network="192.168.1.0/24",
        devices=[
            DeviceResult(
                ip="192.168.1.1",
                hostname="router.local",
                mac_address="AA:BB:CC:DD:EE:FF",
                vendor="TestVendor",
                status="online",
                ports=[PortResult(443, "tcp", "https", "open")],
            )
        ],
        duration_seconds=12.5,
    )
    data = result.to_dict()
    assert data["network"] == "192.168.1.0/24"
    assert data["devices"][0]["ip"] == "192.168.1.1"
    assert data["devices"][0]["ports"][0]["port_number"] == 443
