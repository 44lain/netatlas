import pytest

from netatlas.cli import build_parser


def test_root_help() -> None:
    with pytest.raises(SystemExit) as exc:
        build_parser().parse_args(["--help"])
    assert exc.value.code == 0


def test_scan_subcommand_args() -> None:
    parser = build_parser()
    args = parser.parse_args(["scan", "--no-ports", "--network", "10.0.0.0/24", "-o", "out.json"])
    assert args.command == "scan"
    assert args.no_ports is True
    assert args.network == "10.0.0.0/24"
    assert args.output == "out.json"


def test_scan_requires_subcommand() -> None:
    with pytest.raises(SystemExit):
        build_parser().parse_args([])
