import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent / "src"))
from linchat_backend.main import main
main()