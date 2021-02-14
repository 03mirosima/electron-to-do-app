const { app, BrowserWindow, Menu, ipcMain } = require("electron");


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("./app/main-window/index.html");

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  return mainWindow;
}
app.whenReady().then(createWindow);

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: "Yapılacak Ekle",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  addWindow.loadFile("./app/addToDo/addWindow.html");

  return addWindow;
}

ipcMain.on("item:add", function (e, item) {
  console.log(item);
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const mainMenuTemplate = [
  {
    label: "Yapılacakları Düzenle",
    submenu: [
      {
        label: "Yapılacak Ekle",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Tüm Yapılacakaları Temizle",
        click() {
          mainWindow.webContents.send("item:clear");
        },
      },
      {
        label: "Uygulamayı Kapat",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Dev Tools",
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    },
    submenu: [
      {
        label: "Geliştirici Araçlar",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        label: "Tekrar Yükle",
        role: "reload",
      },
    ],
  });
}
