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

# Após registrar, execute na rede local:
netatlas scan --token SEU_TOKEN --agent-id ID --api https://netatlas.vercel.app

# Ou apenas scan local (sem enviar):
netatlas scan --no-ports -o resultado.json
```

## Saída

JSON no stdout com dispositivos, portas abertas, MAC, hostname e fabricante (OUI).

Integração com a plataforma: `--token`, `--agent-id` e `--api` (registre o agente em `/agents`).

## Testes

```bash
pytest
```
