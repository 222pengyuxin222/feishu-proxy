// api/proxy.js
export default async function handler(req, res) {
  // 允许跨域（你的前端可以从任何地方调用）
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 飞书配置 - 请替换为你的真实信息！
  const CONFIG = {
    appId: 'cli_a94b60fef0badbd9',           // 替换这里
    appSecret: 'eQZayMAoGikbE9HgK9uwcf2C2DvJnvpo',   // 替换这里
    appToken: 'JZXJbkOrKabNiKsh4zZc62Funzf',     // 替换这里
    tableId: 'tblKvXLv7g2yXMJM'        // 替换这里
  };

  try {
    // 第一步：获取 tenant_access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: CONFIG.appId,
        app_secret: CONFIG.appSecret
      })
    });
    const tokenData = await tokenRes.json();
    
    if (!tokenData.tenant_access_token) {
      throw new Error(tokenData.msg || '获取token失败');
    }
    const token = tokenData.tenant_access_token;

    // 第二步：获取多维表格数据
    const recordsRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${CONFIG.appToken}/tables/${CONFIG.tableId}/records?page_size=100`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const recordsData = await recordsRes.json();

    // 返回数据给前端
    res.status(200).json(recordsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}