let guildData = null;
let growthData = [];

async function loadGuild() {
  const res = await fetch("/api/guild");
  const data = await res.json();
  if (!data.success) return;

  guildData = data.guild;

  document.getElementById("guildInfo").innerHTML = `
    <h2>${guildData.name}</h2>
    <p><b>Leader:</b> ${guildData.leaderName}</p>
    <p><b>Members:</b> ${guildData.totalMembers}</p>
    <p><b>Last Updated:</b> ${new Date(guildData.lastUpdated).toLocaleTimeString()}</p>
  `;

  updateMembers();
  updateTopFive();
  updateGrowthChart();
}

function updateMembers() {
  let members = [...guildData.members];

  // Search
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  members = members.filter(m => m.name.toLowerCase().includes(keyword));

  // Sorting
  const sortBy = document.getElementById("sortSelect").value;
  if (sortBy === "level") members.sort((a,b)=>b.level - a.level);
  if (sortBy === "name") members.sort((a,b)=>a.name.localeCompare(b.name));
  if (sortBy === "rank") members.sort((a,b)=>(b.rank||0)-(a.rank||0));

  const container = document.getElementById("members");
  container.innerHTML = "";

  members.forEach(m => {
    let role = "";
    if (m.name === guildData.leaderName) role = "<span class='leader'>Leader</span>";
    else if (m.role?.toLowerCase()?.includes("officer")) role = "<span class='officer'>Officer</span>";

    container.innerHTML += `
      <div class='member' onclick="openModal('${m.name}', ${m.level}, '${m.rank||"N/A"}')">
        ${m.name} — Level ${m.level}
        <span class='rankTag'>${m.rank || "N/A"}</span><br>
        ${role}
      </div>
    `;
  });
}

function updateTopFive() {
  let top = [...guildData.members]
    .sort((a,b)=>b.level - a.level)
    .slice(0, 5);

  const div = document.getElementById("topFive");
  div.innerHTML = top.map(m => `
    <div class="member">
      ${m.name} — Level ${m.level}
      <span class="rankTag">${m.rank||"N/A"}</span>
    </div>
  `).join("");
}

function updateGrowthChart() {
  if (!growthData.length) {
    growthData.push({ time: new Date().toLocaleTimeString(), count: guildData.totalMembers });
  }

  if (growthData.length > 10) growthData.shift();

  growthData.push({
    time: new Date().toLocaleTimeString(),
    count: guildData.totalMembers
  });

  const ctx = document.getElementById("growthChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: growthData.map(d => d.time),
      datasets: [{
        label: "Member Growth",
        data: growthData.map(d => d.count),
        borderWidth: 2
      }]
    }
  });
}

function openModal(name, level, rank) {
  const modal = document.createElement("div");
  modal.className = "modal-bg show";
  modal.innerHTML = `
    <div class="modal">
      <h2>${name}</h2>
      <p>Level: ${level}</p>
      <p>Rank: ${rank}</p>
      <button onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

document.getElementById("searchInput").addEventListener("input", updateMembers);
document.getElementById("sortSelect").addEventListener("change", updateMembers);

loadGuild();
setInterval(loadGuild, 8000);
