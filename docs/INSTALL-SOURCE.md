# Installer Palma depuis le code source

Ce guide s'adresse aux personnes qui veulent **modifier** le code, **reconstruire** l'application elles-mêmes, ou simplement comprendre comment elle fonctionne.

> 💡 Si tu veux juste **utiliser** Palma, télécharge directement un `.exe` depuis la [page Releases](https://github.com/izakk-exe/hand_synth/releases). Pas besoin de ce guide.

---

## 🧰 Ce qu'il te faut

| Outil | Pourquoi | Lien |
|-------|----------|------|
| **Node.js LTS** | Fait tourner le script de build | [nodejs.org](https://nodejs.org/en/download) |
| **Git** (optionnel) | Récupérer le code source | [git-scm.com](https://git-scm.com/downloads) |
| **Windows 10 ou 11** 64-bit | Le build cible Windows | — |
| **~2 Go d'espace disque libre** | Node modules + Electron prebuilt | — |
| **Connexion internet** | Uniquement pour le premier build | — |

> 💡 Si tu n'as pas Git, tu peux télécharger un ZIP du code en cliquant sur **Code → Download ZIP** sur la page GitHub.

---

## 📥 Étape 1 — Installer Node.js

1. Va sur **[nodejs.org/en/download](https://nodejs.org/en/download)**
2. Télécharge la version **LTS** (Long Term Support) pour **Windows (x64)**
3. Lance l'installateur, clique *Next* sur tout, laisse les options par défaut
4. Redémarre ton ordinateur après l'installation

**Pour vérifier que ça a marché** : ouvre **PowerShell** (clic droit sur le menu Démarrer → *Windows Terminal* ou *PowerShell*) et tape :

```powershell
node -v
```

Tu dois voir quelque chose comme `v20.11.0`. Si tu vois ça, c'est bon ✅.

---

## 📥 Étape 2 — Récupérer le code source

### Option A — Avec Git (recommandé)

```powershell
cd Desktop
git clone https://github.com/izakk-exe/hand_synth.git
cd hand_synth
```

### Option B — Sans Git (téléchargement ZIP)

1. Va sur **[la page GitHub du projet](https://github.com/izakk-exe/hand_synth)**
2. Clique sur le bouton vert **Code**
3. Clique sur **Download ZIP**
4. Décompresse le ZIP où tu veux (ex. `Desktop\hand_synth`)
5. Ouvre le dossier décompressé

---

## 🚀 Étape 3 — Lancer l'application

### Pour **tester rapidement** (recommandé pour développer)

Double-clique sur :

```
install/RUN_DEV.bat
```

Le script fait automatiquement :
1. Télécharge MediaPipe + Tone.js + Three.js dans `vendor/`
2. Installe Electron localement (dossier `node_modules/`)
3. Lance l'application en mode développement

**Premier lancement : 2 à 5 minutes** (téléchargement d'Electron ~200 Mo).
Lancements suivants : quelques secondes.

### Pour **créer les fichiers .exe** finaux

Double-clique sur :

```
install/BUILD.bat
```

Le script fait tout ce qu'il faut :
1. Vérifie que Node.js est installé (le propose via winget sinon)
2. Télécharge les bibliothèques vendor
3. Installe Electron + electron-builder
4. Compile deux `.exe` dans `install/output/` :
   - `Palma-1.0.0-x64-win.exe` — installateur classique
   - `Palma-1.0.0-portable.exe` — version portable

**Premier build : 5 à 10 minutes.** Builds suivants : 1 à 2 minutes.

---

## 🧹 Étape 4 — Nettoyer (optionnel)

Pour tout remettre à zéro et libérer de l'espace disque :

```
install/CLEAN.bat
```

Supprime `node_modules/`, `dist/`, `vendor/`, et `install/output/`. Il faudra tout re-télécharger au prochain build.

---

## 📂 Que contient chaque fichier ?

```
hand_synth/
├── index.html          ← toute l'app : UI, scènes 3D, synthé, patch
├── main.js             ← fenêtre Electron, permissions caméra, GPU flags
├── preload.js          ← pont pour les boutons de la barre de titre
├── fetch_vendor.js     ← télécharge MediaPipe + Tone + Three dans vendor/
├── package.json        ← config Electron-builder + nom + version
├── README.md           ← page d'accueil GitHub
├── LICENSE             ← licence MIT
├── docs/               ← logos, bannières, images du README
└── install/
    ├── BUILD.bat       ← build complet → .exe
    ├── RUN_DEV.bat     ← lance l'app sans packer
    ├── CLEAN.bat       ← efface les builds + dépendances
    ├── LISEZ-MOI.txt   ← notice utilisateur final
    └── output/         ← les .exe apparaissent ici après BUILD.bat
```

---

## 🩹 Dépannage

### « node n'est pas reconnu »
Node.js n'est pas installé ou n'est pas dans le PATH. Réinstalle Node.js et **redémarre** PowerShell (ferme et rouvre une nouvelle fenêtre).

### « Fetching vendor libs » bloque longtemps
Vérifie ta connexion internet. Le script télécharge environ 50 Mo depuis `cdn.jsdelivr.net`.
Si bloqué par un proxy d'entreprise, utilise un autre réseau pour ce premier téléchargement.

### « npm install » plante ou dure très longtemps
- Désactive temporairement l'antivirus (Electron installe des milliers de petits fichiers, certains AV bloquent)
- Lance en **administrateur** (clic droit sur le `.bat` → *Exécuter en tant qu'administrateur*)
- Supprime `node_modules/` et relance

### Le build plante à l'étape « packaging »
Essaie :
```
install/CLEAN.bat
install/BUILD.bat
```

### L'app démarre mais ne voit pas la caméra
- Windows → Paramètres → Confidentialité → Caméra → vérifie que « Applications de bureau » peut utiliser la caméra
- Teste la caméra dans l'app Caméra de Windows pour confirmer qu'elle marche

### L'app démarre mais écran noir ou plante
- Mets à jour tes drivers de carte graphique
- Essaie de lancer avec `--disable-gpu` : clic droit sur l'exe → Propriétés → Cible → ajoute ` --disable-gpu` à la fin

### Je veux modifier le code
Toute l'interface + les scènes sont dans **`index.html`**. Tu peux l'ouvrir avec n'importe quel éditeur (VS Code, Notepad++, Sublime Text).
Après modification, relance `install/RUN_DEV.bat` pour voir le résultat.

---

## 📘 Ressources

- [Documentation Electron](https://www.electronjs.org/docs/latest)
- [Documentation MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [Documentation Three.js](https://threejs.org/docs/)
- [Documentation Tone.js](https://tonejs.github.io/docs/)

---

**Built by 1Z4K**
