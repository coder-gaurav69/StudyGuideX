import React from 'react';

const handleClick = (e) => {
    console.log(e.target.dataset.key);
};

const Practise = () => {
  return (
    <div>
      <input type="file" data-key="1" onClick={handleClick} style={{ border: 'solid 1px red' }} />
      <input type="file" data-key="2" onClick={handleClick} style={{ border: 'solid 1px red' }} />
      <input type="file" data-key="3" onClick={handleClick} style={{ border: 'solid 1px red' }} />
      hel
    </div>
  );
};

export default Practise;
