import { useEffect, useState } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, selectCountry] = useState("");
  const [selectedState, selectState] = useState("");
  const [selectedCity, selectCity] = useState("");
  const [loading, setLoading] = useState(true);
  const SelectedText = () => {
    return (
      <p style={{ textAlign: "center" }}>
        <strong>You Selected {selectedCity},</strong>{" "}
        <span color="grey">
          {selectedState}, {selectedCountry}
        </span>
      </p>
    );
  };
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://crio-location-selector.onrender.com/countries"
      );
      const resCountries = await res.json();
      resCountries.sort();
      setCountries(() => [...resCountries]);
    } catch (error) {
      console.error(new Error(error));
    } finally {
      setLoading(false);
    }
  };
  const fetchStates = async (country) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/states`
      );
      const resStates = await res.json();
      resStates.sort();
      setStates(() => [...resStates]);
    } catch (error) {
      console.error(new Error(error));
    } finally {
      setLoading(false);
    }
  };
  const fetchCities = async (state, country) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`
      );
      const resCities = await res.json();
      resCities.sort();
      setCities(() => [...resCities]);
    } catch (error) {
      console.error(new Error(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countries.length === 0) fetchCountries();
    if (selectedCountry) fetchStates(selectedCountry);
    if (selectedState && selectedCountry)
      fetchCities(selectedState, selectedCountry);
  }, [selectedCountry, selectedState]);

  return (
    <section>
      <h1 style={{ textAlign: "center" }}>Select Location</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <select
          style={{
            padding: "0.5rem",
            width: "20%",
          }}
          name="country"
          value={selectedCountry}
          onChange={(e) => {
            selectCountry(e.target.value);
            selectState("");
            selectCity("");
          }}
        >
          <option value="">Select Country</option>
          {countries.map((cnt, index) => (
            <option key={`${cnt}-${index + 1}`} value={cnt}>
              {cnt}
            </option>
          ))}
        </select>
        <select
          style={{
            padding: "0.5rem",
            width: "20%",
          }}
          name="state"
          disabled={!selectedCountry}
          value={selectedState}
          onChange={(e) => {
            selectState(e.target.value);
            selectCity("");
          }}
        >
          <option value="">Select State</option>
          {states.map((st, index) => (
            <option key={`${st}-${index + 1}`} value={st}>
              {st}
            </option>
          ))}
        </select>
        <select
          style={{
            padding: "0.5rem",
            width: "20%",
          }}
          name="country"
          disabled={!selectedState}
          value={selectedCity}
          onChange={(e) => selectCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((c, index) => (
            <option key={`${c}-${index + 1}`} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : selectedCountry && selectedState && selectedCity ? (
        <SelectedText />
      ) : null}
    </section>
  );
}

export default App;
