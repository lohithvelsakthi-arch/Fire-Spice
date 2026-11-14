plugins {
  alias(libs.plugins.android.application)
}

android {
  namespace = "com.firespice.restaurant"
  compileSdk = 35

  defaultConfig {
    applicationId = "com.firespice.restaurant"
    minSdk = 24
    targetSdk = 35
    versionCode = 2
    versionName = "1.0.1"
  }

  buildTypes {
    release {
      isMinifyEnabled = false
      proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
  }

  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }

  buildFeatures {
    compose = false
    aidl = false
    buildConfig = false
    shaders = false
  }
}

dependencies {
}
