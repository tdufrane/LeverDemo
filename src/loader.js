window.loadLeverJobs = function (options) {
  options.accountName = options.accountName.toLowerCase();

  var jobsContainer =
    document.getElementById("lever-jobs-container") || document.body;
  var departmentFilter = options.departmentFilter || null;

  var htmlTagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };

  function sanitizeForHTML(str) {
    if (str === undefined || str === null) {
      return "";
    }
    return String(str).replace(/[&<>]/g, function (tag) {
      return htmlTagsToReplace[tag] || tag;
    });
  }

  function sanitizeAttribute(str) {
    if (!str) {
      return "uncategorized";
    }
    return sanitizeForHTML(str).replace(/\s+/gi, "");
  }

  function isDepartmentFilterActive() {
    return departmentFilter && Array.isArray(departmentFilter) && departmentFilter.length > 0;
  }

  function groupPostingsByDepartment(responseData) {
    var departments = [];
    var departmentMap = {};

    for (var i = 0; i < responseData.length; i++) {
      var group = responseData[i];
      if (!group || !group.postings || group.postings.length === 0) continue;

      for (var j = 0; j < group.postings.length; j++) {
        var posting = group.postings[j];
        var teamTitle = posting.categories.team || "Uncategorized";
        var teamKey = sanitizeAttribute(teamTitle);
        var deptTitle = posting.categories.department || "Uncategorized";
        var deptKey = sanitizeAttribute(deptTitle);

        if (departmentMap[deptKey] === undefined) {
          departmentMap[deptKey] = departments.length;
          departments.push({
            department: deptKey,
            departmentTitle: deptTitle,
            teams: [],
            teamMap: {},
          });
        }

        var dept = departments[departmentMap[deptKey]];

        if (dept.teamMap[teamKey] === undefined) {
          dept.teamMap[teamKey] = dept.teams.length;
          dept.teams.push({
            team: teamKey,
            teamTitle: teamTitle,
            postings: [],
          });
        }

        dept.teams[dept.teamMap[teamKey]].postings.push(posting);
      }
    }

    departments.sort(function (a, b) {
      var aKey = a.department.toLowerCase();
      var bKey = b.department.toLowerCase();
      if (aKey < bKey) return -1;
      if (aKey > bKey) return 1;
      return 0;
    });

    for (var i = 0; i < departments.length; i++) {
      delete departments[i].teamMap;
    }

    return departments;
  }

  function filterByDepartment(departments) {
    if (!isDepartmentFilterActive()) return departments;

    var filtered = [];
    for (var i = 0; i < departments.length; i++) {
      var dept = departments[i];
      for (var f = 0; f < departmentFilter.length; f++) {
        var filterValue = departmentFilter[f].toLowerCase();
        if (
          dept.departmentTitle.toLowerCase() === filterValue ||
          dept.department.toLowerCase() === filterValue
        ) {
          filtered.push(dept);
          break;
        }
      }
    }
    return filtered;
  }

  function buildPostingLi(posting, deptTitle) {
    return '<li class="lever-job" data-department="' +
      deptTitle +
      '" data-team="' +
      (posting.categories.team || "") +
      '" data-location="' +
      (posting.categories.location || "") +
      '" data-work-type="' +
      (posting.categories.commitment || "") +
      '"><a class="lever-job-title" href="' +
      posting.hostedUrl +
      '">' +
      sanitizeForHTML(posting.text) +
      '</a><span class="lever-job-tag">' +
      (sanitizeForHTML(posting.categories.location) || "") +
      "</span></li>";
  }

  function buildJobHtml(departments) {
    var showDepartmentHeaders = departments.length >= 2;
    var htmlParts = [];
    var jobsOnlyParts = [];

    for (var i = 0; i < departments.length; i++) {
      var dept = departments[i];

      if (showDepartmentHeaders) {
        htmlParts.push(
          '<section class="lever-department" data-department="',
          dept.departmentTitle,
          '"><h3 class="lever-department-title">',
          sanitizeForHTML(dept.departmentTitle),
          "</h3>"
        );
      }

      for (var j = 0; j < dept.teams.length; j++) {
        var team = dept.teams[j];
        htmlParts.push(
          '<ul class="lever-team" data-team="',
          team.teamTitle,
          '"><li><h4 class="lever-team-title">',
          sanitizeForHTML(team.teamTitle),
          "</h4><ul>"
        );

        for (var k = 0; k < team.postings.length; k++) {
          var li = buildPostingLi(team.postings[k], dept.departmentTitle);
          htmlParts.push(li);
          jobsOnlyParts.push(li);
        }

        htmlParts.push("</ul></li></ul>");
      }

      if (showDepartmentHeaders) {
        htmlParts.push("</section>");
      }
    }

    return { full: htmlParts.join(""), jobsOnly: jobsOnlyParts.join("") };
  }

  function createJobs(responseData) {
    if (!responseData) return;
    if (typeof responseData === "string")
      responseData = JSON.parse(responseData);

    var departments = groupPostingsByDepartment(responseData);
    departments = filterByDepartment(departments);

    if (departments.length === 0) {
      jobsContainer.innerHTML = "<p class='lever-no-postings'>No results</p>";
      return;
    }

    var html = buildJobHtml(departments);
    jobsContainer.innerHTML = html.full;

    var newListUl = document.querySelector("#new-list ul");
    if (newListUl) {
      newListUl.innerHTML = html.jobsOnly;
    }

    window.leverDepartmentFilterActive = isDepartmentFilterActive();
    window.dispatchEvent(new Event("leverJobsRendered"));
  }

  var url =
    "https://api.lever.co/v0/postings/" +
    options.accountName +
    "?group=team&mode=json";

  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error("Lever API error: " + res.status);
      return res.json();
    })
    .then(createJobs)
    .catch(function () {
      console.error("Error fetching jobs from Lever API.");
      jobsContainer.innerHTML = "<p class='lever-error'>Error fetching jobs.</p>";
    });
};

window.loadLeverJobs(window.leverJobsOptions);
