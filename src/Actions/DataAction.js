import axios from "axios";
import Card from "../components/Card/Card";

// Define action types as constants
const DATA_REQUEST = "DATA_REQUEST";
const DATA_SUCCESS = "DATA_SUCCESS";
const DATA_FAILURE = "DATA_FAILURE";
const SELECT_DATA_REQUEST = "SELECT_DATA_REQUEST";
const SELECT_DATA_SUCCESS = "SELECT_DATA_SUCCESS";
const SELECT_DATA_FAILURE = "SELECT_DATA_FAILURE";
export const fetchAllData = () => async (dispatch) => {
  try {
    dispatch({ type: DATA_REQUEST });
    const { data } = await axios.get(
      "https://api.quicksell.co/v1/internal/frontend-assignment/"
    );
    dispatch({ type: DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: DATA_FAILURE });
  }
};
export const selectData =
  (group, allTickets, orderValue) => async (dispatch) => {
    try {
      dispatch({ type: SELECT_DATA_REQUEST });
      let alluser = false;
      let mySet = new Set();
      let elementStore = [],
        selectedData = [];
      if (group === "status") {
        allTickets.forEach((element) => {
          mySet.add(element.status);
        });
        elementStore = [...mySet];
        elementStore.forEach((element, index) => {
          let elementStore = allTickets.filter((fElement) => {
            return element === fElement.status;
          });
          selectedData.push({
            [index]: {
              title: element,
              value: elementStore,
            },
          });
        });
      } else if (group === "user") {
        alluser = true;
        allTickets?.allUser?.forEach((element, index) => {
          elementStore = allTickets?.allTickets?.filter((Felement) => {
            return element.id === Felement.userId;
          });
          selectedData.push({
            [index]: {
              title: element.name,
              value: elementStore,
            },
          });
        });
      } else {
        let prior_list = ["No priority", "Urgent", "High", "Medium", "Low"];
        prior_list.forEach((element, index) => {
          elementStore = allTickets.filter((fElement) => {
            return index === fElement.priority;
          });

          selectedData.push({
            [index]: {
              title: element,
              value: elementStore,
            },
          });
        });
      }
      if (orderValue === "title") {
        selectedData.forEach((element, index) => {
          element[index]?.value?.sort((a, b) => a.title.localeCompare(b.title));
        });
      }
      if (orderValue === "priority") {
        selectedData.forEach((element, index) => {
          element[index]?.value?.sort((a, b) => b.priority - a.priority);
        });
      }
      dispatch({ type: SELECT_DATA_SUCCESS, payload: { selectedData,alluser } });
    } catch (error) {
      dispatch({ type: SELECT_DATA_FAILURE, payload: error.message });
    }
  };
