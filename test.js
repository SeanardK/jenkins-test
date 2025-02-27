const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Konfigurasi repository
const REPOSITORIES = [
  {
    source: "https://github.com/user/repo1.git", // Repository asal
    destination: "git@github.com:user/new-repo1.git", // Repository tujuan
  },
];

// Folder sementara untuk cloning
const BASE_DIR = path.join(__dirname, "temp_repos");

// Pastikan folder kerja bersih
if (fs.existsSync(BASE_DIR)) {
  fs.rmSync(BASE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(BASE_DIR, { recursive: true });

const runCommand = (command, cwd = null) => {
  try {
    console.log(`🔹 Running: ${command}`);
    execSync(command, { stdio: "inherit", cwd });
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
};

const cloneAndPush = ({ source, destination }) => {
  const repoName = path.basename(source, ".git");
  const repoDir = path.join(BASE_DIR, repoName);

  console.log(`\n🚀 Processing ${repoName}...`);

  // Clone repository
  console.log(`🔄 Cloning ${source} ...`);
  runCommand(`git clone --mirror ${source} ${repoDir}`);

  // Push ke repository tujuan
  console.log(`🚀 Pushing to ${destination} ...`);
  runCommand(`git remote set-url origin ${destination}`, repoDir);
  runCommand(`git push --mirror`, repoDir);

  console.log(`✅ ${repoName} has been successfully pushed to ${destination}`);
};

// Jalankan proses untuk setiap repository
REPOSITORIES.forEach(cloneAndPush);

// Hapus folder sementara setelah selesai
fs.rmSync(BASE_DIR, { recursive: true, force: true });
console.log("\n🎉 All repositories have been cloned and pushed successfully!");
