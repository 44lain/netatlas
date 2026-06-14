# NetAtlas Agent

CLI Python para descoberta de dispositivos e scan de portas na rede local.

## Pré-requisitos

- Python 3.11+
- [Nmap](https://nmap.org/) instalado no sistema
- Linux: comando `ip` (iproute2)

## Instalação

```bash
cd apps/agent
pip install -e ".[dev]"
```

## Uso

```bash
# Ajuda
netatlas --help
netatlas scan --help

# Scan completo (detecta rede local automaticamente)
netatlas scan

# Apenas descoberta, sem portas
netatlas scan --no-ports

# Rede específica + salvar JSON
netatlas scan --network 192.168.1.0/24 -o resultado.json

# Portas customizadas
netatlas scan --ports 22,80,443,8080
```

## Saída

JSON no stdout com dispositivos, portas abertas, MAC, hostname e fabricante (OUI).

Integração com a plataforma web (`--token`, `--api`) — Sprint 4.

## Testes

```bash
pytest
```
