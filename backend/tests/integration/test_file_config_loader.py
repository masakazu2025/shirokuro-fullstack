import json
import pytest
from pathlib import Path

from domain.transaction.transaction import FileConfig
from infra.config.file_config_loader import load_file_configs


def test_load_returns_empty_when_file_not_found(tmp_path):
    result = load_file_configs(tmp_path / "nonexistent.json")
    assert result == []


def test_load_returns_empty_when_file_configs_is_empty(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({"file_configs": []}), encoding="utf-8")
    result = load_file_configs(config)
    assert result == []


def test_load_single_config(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": r"\.dat$", "encoding": "cp932"}
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 1
    assert result[0].filename_pattern == r"\.dat$"
    assert result[0].encoding == "cp932"


def test_load_multiple_configs(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": r"\.dat$", "encoding": "cp932"},
            {"filename_pattern": r"^header", "encoding": "utf-8"},
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 2
    assert result[1].filename_pattern == r"^header"
    assert result[1].encoding == "utf-8"


def test_load_config_without_encoding(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": r"\.log$"}
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 1
    assert result[0].encoding is None


def test_loaded_config_matches_filename(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": r"\.dat$", "encoding": "cp932"}
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert result[0].matches("data.dat")
    assert not result[0].matches("data.csv")


# --- FileConfig コンストラクタのバリデーション ---

def test_fileconfig_invalid_regex_raises():
    with pytest.raises(ValueError, match="filename_pattern"):
        FileConfig(filename_pattern="[invalid")


def test_fileconfig_invalid_encoding_raises():
    with pytest.raises(ValueError, match="encoding"):
        FileConfig(filename_pattern=r"\.dat$", encoding="not-an-encoding")


def test_fileconfig_invalid_processor_format_raises():
    with pytest.raises(ValueError, match="processor"):
        FileConfig(filename_pattern=r"\.dat$", processor="no_dot")


def test_fileconfig_invalid_order_raises():
    with pytest.raises(ValueError, match="order"):
        FileConfig(filename_pattern=r"\.dat$", order=0)


def test_fileconfig_valid_passes():
    cfg = FileConfig(
        filename_pattern=r"\.dat$",
        encoding="cp932",
        order=1,
        processor="pos.header",
    )
    assert cfg.filename_pattern == r"\.dat$"


# --- load_file_configs のバリデーション・スキップ ---

def test_invalid_regex_entry_is_skipped(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": "[invalid"},
            {"filename_pattern": r"\.csv$"},
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 1
    assert result[0].filename_pattern == r"\.csv$"


def test_invalid_encoding_entry_is_skipped(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": r"\.dat$", "encoding": "not-an-encoding"},
            {"filename_pattern": r"\.csv$"},
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 1
    assert result[0].filename_pattern == r"\.csv$"


def test_missing_filename_pattern_entry_is_skipped(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"encoding": "utf-8"},
            {"filename_pattern": r"\.csv$"},
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 1


# --- order 重複の解決 ---

def test_order_conflict_is_resolved(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": r"\.dat$", "order": 1},
            {"filename_pattern": r"\.csv$", "order": 1},
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 2
    orders = [c.order for c in result]
    # 重複は解消されている（どちらかが None になる）
    assert orders.count(1) == 1


def test_no_conflict_order_unchanged(tmp_path):
    config = tmp_path / "file_config.json"
    config.write_text(json.dumps({
        "file_configs": [
            {"filename_pattern": r"\.dat$", "order": 1},
            {"filename_pattern": r"\.csv$", "order": 2},
        ]
    }), encoding="utf-8")
    result = load_file_configs(config)
    assert len(result) == 2
    by_pattern = {c.filename_pattern: c.order for c in result}
    assert by_pattern[r"\.dat$"] == 1
    assert by_pattern[r"\.csv$"] == 2
