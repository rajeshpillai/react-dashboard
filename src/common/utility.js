import axios from "axios";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

var utility = (function(){

    var showDeleteConfirmBox = function(config){
        const options = {
            // title: 'Title',
            message: (config && config.message)?config.message: 'Are you sure you want to delete?',
            buttons: [
              {
                label: 'Delete',
                onClick: () => {
                    if(config && config.onDeleteClick){
                        config.onDeleteClick();
                    }
                }
              },
              {
                label: 'Cancel',
                onClick: () => {
                    if(config && config.onNoClick){
                        config.onNoClick();
                    }
                }
                
              }
            ],
            // childrenElement: () => <div />,
            // customUI: ({ title, message, onClose }) => <div>Custom UI</div>,
            // willUnmount: () => {}
          }
         
          confirmAlert(options)
    }

    return{
        showDeleteConfirmBox:showDeleteConfirmBox
    }

})();

export default utility;