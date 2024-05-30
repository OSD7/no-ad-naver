# server.py

from flask import Flask, request, jsonify

app = Flask(__name__)

# 광고 패턴을 차단하는 함수
def block_ads(html_content):
    # 광고 패턴 정의 (예시)
    ad_patterns = [
        r"<!--\s*ad\s*-->",
        r"class\s*=\s*['\"]?ad['\"]?",
        r"id\s*=\s*['\"]?ad['\"]?",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:first-child > div\.wrap\.id_data > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_data:nth-child(2)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:first-child > div\.wrap\.id_data > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_data:nth-child(3)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:nth-child(2) > div\.wrap\.id_data > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_data:nth-child(2)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:nth-child(2) > div\.wrap\.id_data > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_data:nth-child(3)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:nth-child(2) > div\.wrap\.id_data > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_data:nth-child(5)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:first-child > div\.wrap\.id_data > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_data:nth-child(5)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:last-child > div\.wrap\.id_shopping > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:nth-child(2) > div\.grid1\.id_cui_shop_trend\.MM_REFRESH_BOX\.MM_TREND_PICK:first-child",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:last-child > div\.wrap\.id_shopping > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:nth-child(2) > div\.grid1\.id_cui_shop_trend\.MM_REFRESH_BOX\.MM_HOTDEAL:nth-child(4)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:last-child > div\.wrap\.id_shopping > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_shop_trend\.MM_REFRESH_BOX\.MM_TREND_SHOP:nth-child(3)",
        r"m\.naver\.com###mflick > div\.eg-flick-container > div\.flick-panel\.eg-flick-panel:last-child > div\.wrap\.id_shopping > div\.grid1_wrap\.brick-house:first-child > div\.brick-vowel:first-child > div\.grid1\.id_cui_banner:nth-child(5)",
        r"m\.naver\.com###_MM_REGION_TAB > div\.cp_alarm_area:last-child"
        
    ]

    # 정규표현식을 사용하여 광고를 찾고 제거합니다.
    for pattern in ad_patterns:
        html_content = re.sub(pattern, "", html_content, flags=re.IGNORECASE)

    return html_content

# POST 요청을 처리하는 엔드포인트
@app.route('/block_ads', methods=['POST'])
def block_ads_endpoint():
    data = request.json
    html_content = data.get('html_content', '')
    cleaned_content = block_ads(html_content)
    return jsonify({'cleaned_content': cleaned_content})

# 서버 실행
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)