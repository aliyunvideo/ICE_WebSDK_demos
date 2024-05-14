import {  Card, Tabs} from 'antd';
import React from 'react';
import {ROUTERS} from './routers';

export default function ListDemo() {
   return <Tabs
       style={{margin:'10px auto',width:'90%'}}
       defaultActiveKey={'1'}

       items={ROUTERS.map((router)=>{
         return {
            key:router.title,
            label:router.title,
            children: <Card  title={router.title} extra={[<a href="#">More</a>]} >
               {router.card?<router.card path={router.path} title={router.title} />:null}
            </Card>
         }
      })}

   >

   </Tabs>
}
