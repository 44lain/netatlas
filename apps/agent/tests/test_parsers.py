from netatlas.discovery import _parse_nmap_grepable_hosts
from netatlas.oui import lookup_vendor, normalize_mac
from netatlas.scanner import _parse_nmap_ports_line


def test_parse_nmap_grepable_hosts() -> None:
    output = """
Host: 192.168.1.1 () Status: Up
Host: 192.168.1.2 () Status: Up
Host: 192.168.1.3 () Status: Down
"""
    hosts = _parse_nmap_grepable_hosts(output)
    assert hosts == {"192.168.1.1", "192.168.1.2"}


def test_parse_nmap_ports_line() -> None:
    line = "Host: 192.168.1.1 () Ports: 22/open/tcp//ssh///, 443/open/tcp//https///"
    ports = _parse_nmap_ports_line(line)
    assert len(ports) == 2
    assert ports[0].port_number == 22
    assert ports[0].service_name == "ssh"
    assert ports[1].port_number == 443


def test_normalize_mac() -> None:
    assert normalize_mac("aa-bb-cc-dd-ee-ff") == "AA:BB:CC:DD:EE:FF"


def test_lookup_vendor_intelbras() -> None:
    # Prefixo presente em nmap-mac-prefixes em sistemas com Nmap instalado
    vendor = lookup_vendor("18:0D:2C:FB:F1:99")
    if vendor is not None:
        assert vendor == "Intelbras"


def test_lookup_vendor_unknown() -> None:
    assert lookup_vendor("FF:FF:FF:00:00:00") is None
