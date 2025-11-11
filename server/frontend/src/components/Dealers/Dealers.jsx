import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])
  let [searchQuery, setSearchQuery] = useState("");
  let [hasSearched, setHasSearched] = useState(false);

  // let root_url = window.location.origin
  const dealer_url = "/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";

  const handleInputChange = (e) => {
    let state = e.target.value;
    setSearchQuery(state);
    console.log("state:", searchQuery)
  }

  const searchStates = async (e) => {
    for(let state of states){
      if(searchQuery.toLowerCase() === state.toLowerCase()){
            dealer_url_by_state = dealer_url_by_state+state;
            const res = await fetch(dealer_url_by_state, {
              method: "GET"
            });
            const retobj = await res.json();
            if(retobj.status === 200) {
            let state_dealers = Array.from(retobj.dealers)
              setDealersList(state_dealers)
              setHasSearched(true);
            }
          }
        }
      }

  const isSearching = () => {
    return hasSearched;
  }

  const handleLostFocus = (e) => {
      get_dealers();
      setSearchQuery("");
      setHasSearched(false);
  }

  const get_dealers = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers)
      let states = [];
      all_dealers.forEach((dealer)=>{
        states.push(dealer.state)
      });

      setStates(Array.from(new Set(states)))
      setDealersList(all_dealers)
    }
  }
  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div>
      <Header/>

     <table className='table'>
      <tr>
      <th>ID</th>
      <th>Dealer Name</th>
      <th>City</th>
      <th>Address</th>
      <th>Zip</th>
      <th>
        <form>
          <input type="text" placeholder='Search States...' onChange={handleInputChange} value={searchQuery}/>
          {isSearching() ? 
          <input type="button" value="clear" onClick={handleLostFocus}/> : 
          <input type="button" value="search"  onClick={searchStates}/>}
        </form>
      </th>
      {isLoggedIn ? (
          <th>Review Dealer</th>
         ):<></>
      }
      </tr>
     {dealersList.map(dealer => (
        <tr>
          <td>{dealer['id']}</td>
          <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn ? (
            <td>
              <a href={`/postreview/${dealer['id']}`}>
                <img src={review_icon} className="review_icon" alt="Post Review"/>
              </a>
            </td>
           ):<></>
          }
        </tr>
      ))}
     </table>;
  </div>
)
}

export default Dealers
