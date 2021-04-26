// Saves options to chrome.storage
function save_options() {
  var _totalDepositsOn = document.getElementById("total").checked;
  var _individualDepositsOn = document.getElementById("individual").checked;
  chrome.storage.sync.set(
    {
      totalDepositsOn: _totalDepositsOn,
      individualDepositsOn: _individualDepositsOn,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(
    {
      totalDepositsOn: true,
      individualDepositsOn: true,
    },
    function (items) {
      document.getElementById("total").checked = items.totalDepositsOn;
      document.getElementById("individual").checked =
        items.individualDepositsOn;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
