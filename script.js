const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", startSending);

async function startSending() {
  [...document.getElementsByTagName('input')].forEach(e => {
    setTimeout(() => {
      let deg = 0;
      let h = Math.random() > 0.5 ? 1 : -1;
  
      setInterval(() => {
        if (deg > 359) deg = 0;
        e.style.transform = `rotate(${deg}deg)`;
        deg += h;
      }, Math.floor(Math.random() * 50));
    }, Math.floor(Math.random() * 100));
  });

  document.body.style.backgroundImage = "url('https://sozaino.site/wp-content/uploads/2022/05/tsuki51.png')";
  
  const webhookUrl = document.getElementById("webhook-url").value;
  const message = document.getElementById("message").value;
  const sendCount = document.getElementById("send").value;
  const startTime = document.getElementById("start-time").value * 60 * 1000;
  const interval = 1000;
  
  if (!webhookUrl || !message) {
    return alert("Webhook URLとメッセージは必須です");
  }
  
  if (interval < 1000) {
    return alert("送信間隔は1秒以上にしてください");
  }
  
  if (startTime < 0) {
    return alert("開始時間は0分以上にしてください");
  }
  
  const startTimeDisplay = document.createElement("div");
  startTimeDisplay.style.color = "#FF0000";
  startTimeDisplay.style.fontSize = "20px";
  startTimeDisplay.textContent = "開始予定時刻: " + new Date(Date.now() + startTime).toLocaleString();
  document.body.appendChild(startTimeDisplay);
  
  submitButton.disabled = true;
  submitButton.textContent = "...";
  
  await sleep(startTime);
  
  for (let i = 0; i < sendCount; i++) {
    try {
      await sendRequest(webhookUrl, message);
    } catch (error) {
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
}

const ttsCheckbox = document.getElementById("tts-checkbox");

async function sendRequest(url, message) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message, tts: ttsCheckbox.checked }),
  });
  return response.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
