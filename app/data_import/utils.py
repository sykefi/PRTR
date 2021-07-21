from typing import List, Tuple
from pandas import DataFrame


_characters_by_number_1_10 = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten'
}


def _replace_all(word: str, to_replace: Tuple[Tuple[str, str]]):
    for r in to_replace:
        word = word.replace(*r)
    return word


def _get_main_activity_code_enum_name(code: str) -> str:
    if code == 'MISSING':
        return code
    num = int(code[0])
    num_english = _characters_by_number_1_10.get(num)
    name = f"{num_english}{code[1:].strip(')')}"
    return _replace_all(
        name, ((')(', '_'), ('(', '_'), (')', '_'))
    ).upper()


def print_main_activity_codes_as_enum(df: DataFrame):
    unique_values = df['mainActivityCode'].unique()
    print('Unique values in column "mainActivityCode":')
    for value in sorted([v for v in unique_values if v is not None]):
        enum_name = _get_main_activity_code_enum_name(value)
        print(f"    {enum_name} = '{value}'")
    print('\n')
