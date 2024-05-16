# adblocker.py

import re

def block_ads(html_content):
    # 광고 패턴 정의 (예시)
    ad_patterns = [
        r"<!--\s*ad\s*-->",
        r"class\s*=\s*['\"]?ad['\"]?",
        r"id\s*=\s*['\"]?ad['\"]?",
        # 추가적인 광고 패턴들을 여기에 추가할 수 있습니다.
    ]

    # 정규표현식을 사용하여 광고를 찾고 제거합니다.
    for pattern in ad_patterns:
        html_content = re.sub(pattern, "", html_content, flags=re.IGNORECASE)

    return html_content