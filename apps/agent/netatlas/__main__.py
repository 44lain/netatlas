"""Ponto de entrada do NetAtlas Agent."""

from netatlas import __version__


def main() -> None:
    print(f"NetAtlas Agent v{__version__}")
    print("Use 'netatlas scan' — implementação na Sprint 3.")


if __name__ == "__main__":
    main()
