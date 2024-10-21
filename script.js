const submitButton = document.getElementById("submit-button");
const logContainer = document.getElementById("log"); // ログ表示用のコンテナを取得
submitButton.addEventListener("click", startSending);

async function startSending() {
  // 送信ボタンを押した時の回転アニメーションは削除します
  document.body.style.backgroundImage = "url('assets/background.png')";

  const webhookUrl = document.getElementById("webhook-url").value;
  const webhookName = document.getElementById("webhook-name").value;
  const message = document.getElementById("message").value;
  const sendCount = document.getElementById("send").value;
  const startTime = document.getElementById("start-time").value * 60 * 1000;
  const interval = 1000;

  if (!webhookUrl || !message || !webhookName) {
    addLogEntry("Webhook URL、Webhook Name、メッセージは必須です", "failure");
    return;
  }

  if (interval < 1000) {
    addLogEntry("送信間隔は1秒以上にしてください", "failure");
    return;
  }

  if (startTime < 0) {
    addLogEntry("開始時間は0分以上にしてください", "failure");
    return;
  }

  const startTimeDisplay = document.createElement("div");
  startTimeDisplay.style.color = "#FF0000";
  startTimeDisplay.style.fontSize = "20px";
  startTimeDisplay.textContent = "開始予定時刻: " + new Date(Date.now() + startTime).toLocaleString();
  document.body.appendChild(startTimeDisplay);

  submitButton.disabled = true;
  submitButton.textContent = "...";

  addLogEntry(`送信開始予定: ${new Date(Date.now() + startTime).toLocaleString()}`, "info");

  await sleep(startTime);

  for (let i = 0; i < sendCount; i++) {
    try {
      await sendRequest(webhookUrl, webhookName, message);
      addLogEntry(`メッセージ${i + 1}が送信されました`, "success");
    } catch (error) {
      addLogEntry(`メッセージ${i + 1}の送信に失敗しました: ${error.message}`, "failure");
      console.error(error);
    } finally {
      await sleep(interval);
    }
  }

  const endMessageDisplay = document.createElement("div");
  endMessageDisplay.style.color = "#FF0000";
  endMessageDisplay.style.fontSize = "23px";
  endMessageDisplay.textContent = "送信が終了しました " + new Date().toLocaleString();
  document.body.appendChild(endMessageDisplay);

  addLogEntry("すべてのメッセージ送信が完了しました", "success");

  submitButton.disabled = false;
  submitButton.textContent = "送信";
}

// Webhookリクエストを送信する関数
async function sendRequest(url, name, message) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: message,
      username: name
    }),
  });
  return response.json();
}

console.log("Response status:", response.status);
  // レスポンスがOKでなければエラーを投げる
  if (!response.ok) {
    const errorText = await response.text(); // エラーメッセージを取得
    console.error("Error response:", errorText);
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  // レスポンスをJSONとして解析
  const jsonResponse = await response.json();
  return jsonResponse;
}

// ログエントリを追加する関数
function addLogEntry(message, type) {
  const entry = document.createElement("div");
  entry.classList.add("log-entry", type);
  entry.textContent = message;
  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight; // 最新ログに自動スクロール
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
