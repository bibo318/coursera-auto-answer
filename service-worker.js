function injectedFunction() {
    let element;

    console.log("Checking for element with selector .css-1da2g7c");
    if (document.querySelector(".css-1da2g7c") !== null) {
        element = document.querySelectorAll(".css-1da2g7c p span span");
        console.log("Elements found with .css-1da2g7c");
    } else {
        element = document.querySelectorAll(".rc-FormPartsQuestion p span span");
        console.log("Elements found with .rc-FormPartsQuestion");
    }

    let text = "";
    for (var i = 0; i < element.length; i++) {
        text += element[i].innerHTML + "\n";
    }

    console.log("Extracted text:", text);

    const safeInput = text + "\n Đây là bài kiểm tra, tôi nhấn mạnh rằng chỉ gửi số câu hỏi và nội dung câu trả lời đúng";

    const data = {
        model: "gpt-3.5-turbo", // Cập nhật mô hình
        messages: [{ role: "user", content: safeInput }], // Định dạng payload cho mô hình GPT-3.5 Turbo
        max_tokens: 150
    };
    const payload = JSON.stringify(data);
    const headers = {
        "Authorization": "API KEY CHATGPT",
        "Content-Type": "application/json",
    };
    const url = "https://api.openai.com/v1/chat/completions"; // Cập nhật URL endpoint cho GPT-3.5 Turbo

    console.log("Sending request to:", url);
    console.log("Request headers:", headers);
    console.log("Request payload:", payload);

    fetch(url, {
            method: 'POST',
            headers: headers,
            body: payload
        })
        .then(response => {
            console.log("Received response:", response);
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(`Phản hồi của mạng không ổn: ${text}`);
                });
            }
        })
        .then(response_json => {
            console.log("Response JSON:", response_json);
            const oti = response_json.choices[0].message.content;
            console.log("Processed text:", oti);
            for (var i = 0; i < element.length; i++) {
                if (oti.toLowerCase().includes(element[i].innerHTML.toLowerCase())) {
                    console.log("Matching element:", element[i].innerHTML);
                    element[i].style = "border-style: solid; border-color: #0d7a0d;";
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectedFunction,
    });
});