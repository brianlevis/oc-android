#!/bin/sh

# Allows expo to launch on phones with work profiles.
# https://github.com/expo/expo/issues/22473#issuecomment-1546718389
patch -p1 << EOF
--- a/node_modules/@expo/cli/build/src/start/platforms/android/adb.js
+++ b/node_modules/@expo/cli/build/src/start/platforms/android/adb.js
@@ -127,6 +127,14 @@
     if (pid) {
         args.push("-s", pid);
     }
+
+    options = options.map(option => {
+        if (option === "packages") {
+            return "packages --user 0";
+        }
+        return option;
+    });
+
     return args.concat(options);
 }
 async function getAttachedDevicesAsync() {
\ No newline at end of file

EOF

