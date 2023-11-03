plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
}
android {
    namespace = "com.example.androidcheckout"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.androidcheckout"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
        viewBinding = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.4.3"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.activity:activity-compose:1.8.0")
    implementation("androidx.annotation:annotation:1.7.0")
    implementation("androidx.cardview:cardview:1.0.0")
    androidTestImplementation(platform("androidx.compose:compose-bom:2023.03.00"))
    implementation(platform("androidx.compose:compose-bom:2023.03.00"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-graphics")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.coordinatorlayout:coordinatorlayout:1.2.0")
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    annotationProcessor("com.github.bumptech.glide:compiler:4.16.0")
    implementation("com.github.bumptech.glide:glide:4.16.0")
    implementation("com.google.android.material:material:1.10.0")
    implementation("com.google.android.material:material:1.10.0")
    implementation("com.google.code.gson:gson:2.8.9")
    implementation("com.google.firebase:firebase-analytics-ktx")
    implementation("com.google.firebase:firebase-auth-ktx:22.2.0")
    implementation(platform("com.google.firebase:firebase-bom:32.3.1"))
    implementation("com.google.firebase:firebase-database-ktx:20.3.0")
    implementation("com.squareup.picasso:picasso:2.71828")
    implementation("com.squareup.retrofit2:converter-gson:2.3.0")
    implementation("com.squareup.retrofit2:converter-scalars:2.3.0")
    implementation("com.squareup.retrofit2:retrofit:2.4.0")
    testImplementation("junit:junit:4.13.2")
}