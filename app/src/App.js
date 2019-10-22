import React from 'react';
import { Route, Router } from "react-router-dom";
import Menu from './Menu/menu';
import './App.css';

function App() {
  return (
    <div className="App">
      <Menu/>
    </div>
  );
}

export default App;

//Har inte fått router att funka än :'(
//<Router>
//      <div className="App">
//       <Navbar /> {/*Menyn, denna har ingen route för den ska alltid synas */}
//       <Route exact path="/" component={Home} /> {/*Detta är routen till startsidan som i detta fall ska visas när det inte står något efter medieteknik.com i URL:en. */}

//       {/*Lägg till här under om ni har en ny view som ska visas. Enklast kan vara att kopiera <Route exact path="/" component={Home} /> och ändra exact path till den URL:en ni ska ha till er view (ex: "/kontakter" för kontaktsidan) samt ändra component till den filen ni vill ska visas/köras. Kom ihåg att importera filen ni vill ska visas! */}

//     </div>
//   </Router>