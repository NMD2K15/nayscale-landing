const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/speaker_notes.html');
  await p.pdf({ path: 'speaker_notes.pdf', format: 'A4', printBackground: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#999">Datasets VIP · The Webinar Growth Specialist · <span class="pageNumber"></span></div>',
    margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' } });
  await b.close();
})();
