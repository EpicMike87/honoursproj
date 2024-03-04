import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>User Guide</h1>
      
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>Column 1</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Nulla facilisi. Integer vel ante ac nisl placerat ullamcorper. 
            Suspendisse potenti.
          </p>
        </div>

        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>Column 2</h2>
          <p>
            Sed euismod semper libero, at condimentum elit mattis nec. 
            Vestibulum congue quam ac turpis tincidunt, id bibendum metus 
            malesuada. Nunc vel est ac justo facilisis dignissim.
          </p>
        </div>

        <div style={{ flex: 1 }}>
          <h2>Column 3</h2>
          <p>
            Fusce id justo non libero egestas luctus nec vel sem. Quisque 
            congue dolor vitae enim hendrerit, eget fringilla risus 
            ultrices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
