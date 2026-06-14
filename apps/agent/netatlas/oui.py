"""Lookup de fabricante via prefixo OUI (MAC address)."""

from pathlib import Path

# Caminhos comuns do arquivo de prefixos do Nmap
_MAC_PREFIX_PATHS = (
    Path("/usr/share/nmap/nmap-mac-prefixes"),
    Path("/usr/local/share/nmap/nmap-mac-prefixes"),
    Path("/opt/homebrew/share/nmap/nmap-mac-prefixes"),
)

_cache: dict[str, str] | None = None


def _load_prefixes() -> dict[str, str]:
    global _cache
    if _cache is not None:
        return _cache

    prefixes: dict[str, str] = {}
    for path in _MAC_PREFIX_PATHS:
        if not path.is_file():
            continue
        with path.open(encoding="utf-8", errors="ignore") as handle:
            for line in handle:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split(None, 1)
                if len(parts) != 2:
                    continue
                oui_raw, vendor = parts[0].strip().upper(), parts[1].strip()
                # Arquivo Nmap usa formato sem ':' (ex: 180D2C)
                prefixes[oui_raw] = vendor
                if len(oui_raw) == 6:
                    prefixes[f"{oui_raw[0:2]}:{oui_raw[2:4]}:{oui_raw[4:6]}"] = vendor
        break

    _cache = prefixes
    return prefixes


def normalize_mac(mac: str) -> str:
    return mac.upper().replace("-", ":")


def lookup_vendor(mac: str | None) -> str | None:
    """Retorna fabricante a partir do MAC ou None se não encontrado."""
    if not mac:
        return None

    normalized = normalize_mac(mac)
    parts = normalized.split(":")
    if len(parts) < 3:
        return None

    prefix = ":".join(parts[:3])
    vendors = _load_prefixes()
    return vendors.get(prefix)
