"""Saída dos resultados do scan."""

import json
import sys

from netatlas.models import ScanResult


def print_scan_result(result: ScanResult, output_file: str | None = None) -> None:
    """Imprime JSON no stdout ou grava em arquivo."""
    payload = json.dumps(result.to_dict(), indent=2, ensure_ascii=False)

    if output_file:
        with open(output_file, "w", encoding="utf-8") as handle:
            handle.write(payload + "\n")
        print(f"Resultado salvo em {output_file}", file=sys.stderr)
    else:
        print(payload)
