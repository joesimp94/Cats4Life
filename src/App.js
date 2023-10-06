import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ReactModal } from "react-modal";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import Home from "./pages/home";
import About from "./pages/about";
import CartModal from "./components/Cart";

const App = () => {
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search?limit=10"
        );
        if (!response.ok) {
          throw new Error(response.status);
        }
        const data = await response.json();

        const catsNames = data.map((cat) => {
          const catGender = faker.person.sexType();
          return {
            ...cat,
            gender: catGender,
            name: `${faker.person.firstName(
              catGender
            )} ${faker.person.lastName()}`,
            age: faker.number.int({ max: 20 }),

            breed: faker.animal.cat(),
            price: faker.number.int({ max: 500 }),
            sign: faker.person.zodiacSign(),
            job: faker.person.jobType(),

            county: faker.location.county(),
            bought: false,
          };
        });

        setCats(catsNames);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCats();
  }, []);
  if (error !== null) {
    return <h1>{error}</h1>;
  }
  console.log(cats);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // const toggleCatCartButton = (cat) => {
  //   cat.bought = !cat.bought;
  //   console.log(cat.bought);
  //   if (cat.bought == true) {
  //     setCart([...cart]);
  //   }
  // };

  const addToCart = (catToAdd) => {
    if (catToAdd.bought === false) {
      catToAdd.bought = true;
      setCart([...cart, catToAdd]);
    } else {
      setCart(cart);
    }
  };

  const removeFromCart = (catToRemove, index) => {
    let storedCart = [...cart];
    storedCart.splice(index, 1);
    setCart(storedCart);
    catToRemove.bought = false;
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <button onClick={openModal}>Open Cart({cart.length})</button>
        <CartModal
          isOpen={isModalOpen}
          onClose={closeModal}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cart={cart}
        />
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              allCats={cats}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
            />
          }
        ></Route>
        <Route
          path="/about/:catId"
          element={<About singleCat={cats} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
