# APTOS Automation

This project is a TypeScript-based application that utilizes Node.js and npm. It includes a configuration file `MODULES-CONFIG.ts` that sets up various parameters for the application. The script utilizes its modules to simulate network activity on Aptos.

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
-   You have a basic understanding of TypeScript and Node.js.

## Installing Aptos

To install Aptos, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run the following command to install the project dependencies:

```bash
npm install
```

## Configuring Aptos

To configure the application, you need to:

1. Add name:private-key in resources/private-keys:

```
1:YOUR-PRIVATEKEY#1
2:YOUR-PRIVATEKEY#2
```

2. Add any excluded names in resources/excluded-wallets.txt:

```
10, 15
```

3. Adjust various settings in MODULES_CONFIG.ts. These are either self explanatory or marked with comments.
4. To adjust swap token amounts, change percentages in src/services/token-manager.ts

## Running Aptos

To run Aptos, execute the following command:

```bash
npm run aptos
```

## Disclaimer

This script is provided "as is" and any expressed or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the author or contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage. The user assumes all responsibility for the use of this software and runs it at their own risk.
