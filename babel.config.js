module.exports = {
  presets: ['module:@react-native/babel-preset'],
  
  plugins: [
    "react-native-reanimated/plugin", 
    
    ['dotenv-import', {
      moduleName: '@env',
      path: '.env',
    }]
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel']

    },
  },
};
