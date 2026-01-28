window.addEventListener('leverJobsRendered', function() {

  if (window.leverDepartmentFilterActive) {
    $('.lever-jobs-filter-departments').hide();
  }

  var options = {
    valueNames: [
      'lever-job-title',
      { data: ['location'] },
      { data: ['department'] },
      { data: ['team'] },
      { data: ['work-type'] }
    ]
  };

  var jobList = new List('new-list', options);

  function collectUniqueValues(items, key) {
    var seen = {};
    var values = [];
    for (var i = 0; i < items.length; i++) {
      var val = items[i]._values[key];
      if (val && !seen[val]) {
        seen[val] = true;
        values.push(val);
      }
    }
    return values.sort();
  }

  function populateDropdown(selector, values) {
    var dropdown = $('#lever-jobs-filter ' + selector);
    for (var i = 0; i < values.length; i++) {
      dropdown.append('<option>' + values[i] + '</option>');
    }
  }

  populateDropdown('.lever-jobs-filter-locations', collectUniqueValues(jobList.items, 'location'));
  populateDropdown('.lever-jobs-filter-departments', collectUniqueValues(jobList.items, 'department'));
  populateDropdown('.lever-jobs-filter-teams', collectUniqueValues(jobList.items, 'team'));
  populateDropdown('.lever-jobs-filter-work-types', collectUniqueValues(jobList.items, 'work-type'));

  function showFilterResults() {
    $('#new-list .list').show();
    $('#lever-jobs-container').hide();
  }

  function hideFilterResults() {
    $('#new-list .list').hide();
    $('#lever-jobs-container').show();
  }

  function updateNoResultsVisibility() {
    if (jobList.visibleItems.length >= 1) {
      $('#lever-no-results').hide();
    } else {
      $('#lever-no-results').show();
    }
  }

  function getSelectedFilters() {
    return {
      location: $('#lever-jobs-filter select.lever-jobs-filter-locations').val(),
      department: $('#lever-jobs-filter select.lever-jobs-filter-departments').val(),
      team: $('#lever-jobs-filter select.lever-jobs-filter-teams').val(),
      'work-type': $('#lever-jobs-filter select.lever-jobs-filter-work-types').val(),
    };
  }

  hideFilterResults();

  $('#lever-jobs-filter select').change(function() {
    var selectedFilters = getSelectedFilters();

    jobList.filter(function(item) {
      var itemValues = item.values();
      for (var key in selectedFilters) {
        var filterValue = selectedFilters[key];
        if (filterValue !== null && itemValues[key] !== filterValue) {
          return false;
        }
      }
      return true;
    });

    updateNoResultsVisibility();
    $('#lever-clear-filters').show();
    showFilterResults();
  });

  $('#new-list').on('click', '#lever-clear-filters', function() {
    jobList.filter();
    if (jobList.filtered == false) {
      hideFilterResults();
    }
    $('#lever-jobs-filter select').prop('selectedIndex', 0);
    $('#lever-clear-filters').hide();
    $('#lever-no-results').hide();
  });

  $('#new-list').on('input', '#lever-jobs-search', function() {
    if ($(this).val().length || jobList.filtered == true) {
      showFilterResults();
      updateNoResultsVisibility();
    } else {
      hideFilterResults();
      $('#lever-no-results').hide();
    }
  });

});
