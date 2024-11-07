function injectedFunction() {
    function splitText(text, maxLength) {
        let result = [];
        while (text.length > maxLength) {
            let splitIndex = text.lastIndexOf('\n', maxLength);
            if (splitIndex === -1) splitIndex = maxLength;
            result.push(text.slice(0, splitIndex));
            text = text.slice(splitIndex + 1);
        }
        result.push(text);
        return result;
    }

    async function sendRequestToChatGPT(textPart) {
        const data = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: textPart }],
            max_tokens: 150
        };
        const payload = JSON.stringify(data);
        const headers = {
            "Authorization": "Bearer API-KEY-CHATGPT",
            "Content-Type": "application/json",
        };
        const url = "https://api.openai.com/v1/chat/completions";

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: payload
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Phản hồi của mạng không ổn: ${text}`);
        }
        const response_json = await response.json();
        return response_json.choices[0].message.content;
    }

    let element;
    console.log("Checking for element with selector .css-dqaucz");
    if (document.querySelector(".css-dqaucz") !== null) {
        element = document.querySelectorAll(".css-dqaucz p span span");
        console.log("Elements found with .css-dqaucz");
    } else {
        element = document.querySelectorAll(".rc-FormPartsQuestion p span span");
        console.log("Elements found with .rc-FormPartsQuestion");
    }

    let text = "";
    for (let i = 0; i < element.length; i++) {
        text += element[i].innerHTML + "\n";
    }

    console.log("Extracted text:", text);

    const safeInput = text + "\n Đây là bài kiểm tra, tôi nhấn mạnh rằng chỉ gửi số câu hỏi và nội dung câu trả lời đúng";
    const parts = splitText(safeInput, 2000);

    (async function processParts() {
        for (let i = 0; i < parts.length; i++) {
            try {
                console.log(`Sending part ${i + 1} of ${parts.length}`);
                const responseText = await sendRequestToChatGPT(parts[i]);
                console.log("Processed text:", responseText);

                for (let j = 0; j < element.length; j++) {
                    if (responseText.toLowerCase().includes(element[j].innerHTML.toLowerCase())) {
                        console.log("Matching element:", element[j].innerHTML);
                        element[j].style = "border-style: solid; border-color: #0d7a0d;";
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    })();
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectedFunction,
    });
});