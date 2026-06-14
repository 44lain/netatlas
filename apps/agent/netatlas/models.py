"""Modelos de dados do agente."""

from dataclasses import asdict, dataclass, field


@dataclass
class PortResult:
    port_number: int
    protocol: str
    service_name: str | None
    state: str


@dataclass
class DeviceResult:
    ip: str
    hostname: str | None
    mac_address: str | None
    vendor: str | None
    status: str
    ports: list[PortResult] = field(default_factory=list)


@dataclass
class ScanResult:
    network: str
    devices: list[DeviceResult]
    duration_seconds: float

    def to_dict(self) -> dict:
        return asdict(self)
