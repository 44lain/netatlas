"""Scan de portas via Nmap."""

import re
import subprocess

from netatlas.models import PortResult


def _parse_nmap_ports_line(line: str) -> list[PortResult]:
    """Extrai portas de uma linha grepable do Nmap."""
    ports: list[PortResult] = []
    match = re.search(r"Ports:\s+(.+)$", line)
    if not match:
        return ports

    for chunk in match.group(1).split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        # Formato: 443/open/tcp//https///
        parts = chunk.split("/")
        if len(parts) < 3:
            continue
        try:
            port_number = int(parts[0])
        except ValueError:
            continue

        state = parts[1] if parts[1] in ("open", "filtered", "closed") else "open"
        protocol = parts[2] if parts[2] in ("tcp", "udp") else "tcp"
        service_name = parts[4] if len(parts) > 4 and parts[4] else None

        if state == "open":
            ports.append(
                PortResult(
                    port_number=port_number,
                    protocol=protocol,
                    service_name=service_name,
                    state=state,
                )
            )

    return ports


def scan_host_ports(host: str, ports: str = "1-1000") -> list[PortResult]:
    """Executa scan TCP connect (-sT) em um host."""
    try:
        result = subprocess.run(
            [
                "nmap",
                "-sT",
                "-oG",
                "-",
                "-p",
                ports,
                "--open",
                host,
            ],
            capture_output=True,
            text=True,
            check=False,
            timeout=600,
        )
    except (subprocess.SubprocessError, FileNotFoundError) as exc:
        raise RuntimeError("Nmap não encontrado. Instale nmap no sistema.") from exc

    if result.returncode not in (0, 1):
        stderr = result.stderr.strip() or "falha desconhecida"
        raise RuntimeError(f"Nmap scan falhou em {host}: {stderr}")

    for line in result.stdout.splitlines():
        if line.startswith(f"Host: {host}") and "Ports:" in line:
            return _parse_nmap_ports_line(line)

    return []
