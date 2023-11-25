import React, { forwardRef, useState } from 'react';
import { format } from 'date-fns';

const PrintDoc = forwardRef((props, ref) => {
  const [fetched, setFetched] = useState(props.fetched);
  const fdate = (date) => {
    return format(date, 'dd-MM-yyyy');
  };
  let id = 1;

  return (
    <div ref={ref}>
     <table
          className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Sr No.
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Date & Shift
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Weight
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Fat
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Snf
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Milk Rate
              </th>
              <th
                scope="col"
                className="border-r px-2 py-4 dark:border-neutral-500">
                <div className="flex flex-col">
                  <div className="">Credit</div>
                  <div className="text-sm">(दूध वाले ने खरीदा)</div>
                </div>
              </th>
              <th
                scope="col"
                className="border-r px-2 py-4 dark:border-neutral-500">
                <div className="flex flex-col">
                  <div className="">Debit</div>
                  <div className="text-sm">(दूध वाले ने बेचा)</div>
                </div>
              </th>
              <th
                scope="col"
                className="border-r px-6 py-4 dark:border-neutral-500">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
           {
             fetched.map((item,i)=>{
              return (
                <tr key={i} className="text-black border-b font-bold">
                <td
                  className="whitespace-nowrap border-r px-6 py-4 font-medium ">
                  {id++}
                </td>
                <td
                  className="whitespace-nowrap text-black border-r px-6 py-4">
                  {String(fdate(new Date(item.pdate)))} {item.pshift!=""?"-":''} {item.pshift=="Morning"?"M":""} {item.pshift=="Evening"?"E":""}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.weight}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.fat}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.snf}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.pprice}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.ptype=="Buy"?item.totalprice:"-"}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.ptype=="Sell"?item.totalprice:"-"}
                </td>
                <td
                  className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                  {item.remarks}
                </td>
              </tr>
              )
            })
           }
            
          </tbody>
        </table>
    </div>
  );
});

export default PrintDoc;
