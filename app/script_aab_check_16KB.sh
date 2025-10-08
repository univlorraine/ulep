#!/usr/bin/env bash
# check-aab-16kb.sh

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path/to/app-release.aab>"
  exit 1
fi

AAB="$1"
if [[ ! -f "$AAB" ]]; then
  echo "Fichier introuvable: $AAB"
  exit 1
fi

# Choix de l’outil
RE_TOOL=""
if command -v greadelf >/dev/null 2>&1; then
  RE_TOOL="greadelf"
elif command -v readelf >/dev/null 2>&1; then
  RE_TOOL="readelf"
elif command -v objdump >/dev/null 2>&1; then
  RE_TOOL="objdump"
else
  echo "Installe binutils (brew install binutils sur macOS)."
  exit 1
fi

TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t 'aab16kb')"
cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo "Extraction de l’AAB dans: $TMP_DIR"
unzip -qq -o "$AAB" -d "$TMP_DIR"

SO_FILES=()
while IFS= read -r f; do
  SO_FILES+=("$f")
done < <(find "$TMP_DIR" -type f -name "*.so" | sort)

if [[ ${#SO_FILES[@]} -eq 0 ]]; then
  echo "Aucune librairie .so trouvée."
  exit 0
fi

echo "Analyse de ${#SO_FILES[@]} librairie(s) .so …"
bad_count=0

check_with_readelf() {
  local so="$1"
  local aligns
  aligns="$("$RE_TOOL" -l "$so" | awk '/LOAD/{p=1;next} p&&NF{print $NF; p=0}')"
  local ok=1
  for a in $aligns; do
    [[ "$a" == "0x4000" ]] || ok=0
  done
  echo "$ok"
}

check_with_objdump() {
  local so="$1"
  local aligns
  aligns="$(objdump -p "$so" | awk '/Align:/{print $2}')"
  local ok=1
  for a in $aligns; do
    [[ "$a" == "0x4000" ]] || ok=0
  done
  echo "$ok"
}

for so in "${SO_FILES[@]}"; do
  if [[ "$RE_TOOL" == "objdump" ]]; then
    ok="$(check_with_objdump "$so")"
  else
    ok="$(check_with_readelf "$so")"
  fi

  rel="${so#$TMP_DIR/}"
  if [[ "$ok" == "1" ]]; then
    echo "OK   : $rel"
  else
    echo "NOK  : $rel    (Align != 0x4000)"
    ((bad_count++)) || true
  fi
done

echo
if [[ $bad_count -eq 0 ]]; then
  echo "✅ Toutes les libs .so sont alignées sur 16 KB."
else
  echo "❌ $bad_count lib(s) non conformes."
fi
