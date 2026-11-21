"""Compatibility entry point for the consolidated site regression checks."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name("check_site_v2.py")),run_name="__main__")
