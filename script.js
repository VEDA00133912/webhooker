const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", startSending);

async function startSending() {
  document.body.style.backgroundImage = "url('assets/background.png')";

  const webhookUrl = document.getElementById("webhook-url").value;
  const webhookName = document.getElementById("webhook-name").value;
  const message = document.getElementById("message").value;
  const startTime = document.getElementById("start-time").value * 60 * 1000;
  const interval = 1000;

  if (!webhookUrl || !message || !webhookName) {
    return alert("Webhook URL、Webhook Name、メッセージは必須です");
  }

  if (interval < 1000) {
    return alert("送信間隔は1秒以上にしてください");
  }

  if (startTime < 0) {
    return alert("開始時間は0分以上にしてください");
  }

  // ログに開始予定時刻を表示
  logMessage("開始予定時刻: " + new Date(Date.now() + startTime).toLocaleString(), 'info');

  submitButton.disabled = true;
  submitButton.textContent = "...";

  await sleep(startTime);

  try {
    await sendRequest(webhookUrl, webhookName, message);
    logMessage(`メッセージが送信されました: ${message}`, 'success');
  } catch (error) {
    logMessage(`送信エラー: ${error.message}`, 'failure');
  } finally {
    logMessage("送信が終了しました " + new Date().toLocaleString(), 'info');
    submitButton.disabled = false; // 送信終了後、ボタンを再有効化
    submitButton.textContent = "送信"; // ボタンのテキストをリセット
  }
}

async function sendRequest(url, name, message) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: message,
      username: name
    }),
  });

  // レスポンスをチェックしてJSONを返す
  if (!response.ok) {
    throw new Error('リクエストに失敗しました。ステータスコード: ' + response.status);
  }

  return response.json();
}

function logMessage(message, type) {
  const logEntries = document.getElementById('log-entries');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = message;
  logEntries.appendChild(entry);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
