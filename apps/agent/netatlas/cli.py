"""Interface de linha de comando do NetAtlas Agent."""

import argparse
import sys
import time

from netatlas import __version__
from netatlas.discovery import detect_local_network, discover_hosts
from netatlas.models import DeviceResult, ScanResult
from netatlas.reporter import print_scan_result
from netatlas.scanner import scan_host_ports


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="netatlas",
        description="NetAtlas Agent — descoberta e scan de rede local",
    )
    parser.add_argument("--version", action="version", version=f"NetAtlas Agent {__version__}")

    subparsers = parser.add_subparsers(dest="command", required=True)

    scan_parser = subparsers.add_parser("scan", help="Descobrir dispositivos e escanear portas")
    scan_parser.add_argument(
        "--network",
        help="Sub-rede CIDR (ex: 192.168.1.0/24). Padrão: detectar automaticamente",
    )
    scan_parser.add_argument(
        "--ports",
        default="1-1000",
        help="Portas para scan (padrão: 1-1000)",
    )
    scan_parser.add_argument(
        "--no-ports",
        action="store_true",
        help="Apenas descoberta, sem scan de portas",
    )
    scan_parser.add_argument(
        "--no-hostnames",
        action="store_true",
        help="Não resolver hostnames via DNS reverso",
    )
    scan_parser.add_argument(
        "-o",
        "--output",
        help="Salvar resultado JSON em arquivo",
    )
    scan_parser.add_argument(
        "-q",
        "--quiet",
        action="store_true",
        help="Suprimir mensagens de progresso no stderr",
    )

    return parser


def _log(message: str, quiet: bool) -> None:
    if not quiet:
        print(message, file=sys.stderr)


def run_scan(args: argparse.Namespace) -> int:
    network = args.network or detect_local_network()
    if not network:
        print("Erro: não foi possível detectar a rede local. Use --network.", file=sys.stderr)
        return 1

    started = time.monotonic()
    _log(f"Descobrindo hosts em {network}...", args.quiet)

    try:
        hosts = discover_hosts(network, resolve_hostnames=not args.no_hostnames)
    except RuntimeError as exc:
        print(f"Erro: {exc}", file=sys.stderr)
        return 1

    _log(f"{len(hosts)} host(s) encontrado(s).", args.quiet)

    devices: list[DeviceResult] = []
    for index, host in enumerate(hosts, start=1):
        ports = []
        if not args.no_ports:
            _log(f"[{index}/{len(hosts)}] Escaneando {host.ip}...", args.quiet)
            try:
                ports = scan_host_ports(host.ip, ports=args.ports)
            except RuntimeError as exc:
                _log(f"Aviso: {exc}", args.quiet)

        devices.append(
            DeviceResult(
                ip=host.ip,
                hostname=host.hostname,
                mac_address=host.mac_address,
                vendor=host.vendor,
                status=host.status,
                ports=ports,
            )
        )

    duration = round(time.monotonic() - started, 2)
    result = ScanResult(network=network, devices=devices, duration_seconds=duration)

    print_scan_result(result, output_file=args.output)
    _log(f"Scan concluído em {duration}s.", args.quiet)
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "scan":
        return run_scan(args)

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
