// 5 second timeout:

const sendQuery = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch('/gowno', { signal: controller.signal });
    console.log('jest');
  } catch (e) {
    console.log(e);
  } finally {
    sendQuery();
  }
};

sendQuery();
