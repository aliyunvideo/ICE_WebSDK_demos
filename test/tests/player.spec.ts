import { test, expect } from '@playwright/test';
import useNotifyStatus from '../util/useNotifyStatus';



test.beforeEach(async ({page},testInfo)=>{

   await page.goto('http://127.0.0.1:4001/player.html?projectId=956fa33120084d87b90841ef71ca5b74',{waitUntil:'networkidle'});
});



test('init',async ({page},testInfo)=>{

   const notify = useNotifyStatus(page);
   test.slow();
   await page.locator('.ant-tabs-tab-btn',{hasText:'预览项目'}).click();
   await page.locator('button',{hasText:'预 览'}).click();

   await notify.waitUntil((event)=>{
      console.log('event',event);
      return event.status === 'canplay'
   });
   await  page.locator('.views_player_mainContainer__2u0q-').screenshot({path:'test.png'});
   await new Promise((resolve)=>{
       setTimeout(resolve,1000);
   });
   page.on('pageerror',(err)=>{
      console.log('>>>error',err);
      testInfo.fail();
   });

   await  expect(page.locator('.views_player_mainContainer__2u0q-')).toHaveScreenshot('render.png',{maxDiffPixelRatio:0.1});

});
