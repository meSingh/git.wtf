<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    @include('layouts.partials.analytics')
    @include('layouts.partials.head')
    @include('layouts.partials.fonts')
    @yield('meta')

    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css" />
</head>
<!-- <body class="font-brand text-base tracking-normal align-middle leading-relaxed text-gray-900 m-0 relative bg-gray-200 " style="background: #364f6b"> -->

<body class="font-sans text-base tracking-wide leading-relaxed text-brand-alt m-0 relative bg-gray-400">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ config('services.analytics.gtm_id') }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <div id="app">
        <div class="sticky top-0 z-20 bg-brand p-1"></div>
        <header class="bg-brand border-0 border-b border-solid border-gray-300">
            <div class="flex justify-between mx-auto pb-0 md:pb-4 px-4 md:px-12">
                <a href="/" class="flex justify-center items-center flex-shrink-0 pt-2 mr-6 group no-underline text-white hover:text-white">
                    <!-- <span class="font-semibold text-2xl text-red-200 group-hover:text-white mr-1">Git<span class="font-black text-white">.</span>WTF </span> -->
                    <!-- <img src="/images/logo.png" class="w-20"> -->
                    <svg data-v-d3f97b9e="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248 90" width="125px" class=""><!----><!----><!----><g data-v-d3f97b9e="" id="2f3ff5fc-4426-4acc-b6af-3e9e6b90d123" fill="#F7F9FD" transform="matrix(3.9920157856886425,0,0,3.9920157856886425,10.82885685048892,2.0259496501862273)" ><path d="M3.60 7.85L3.60 7.85L3.60 7.85Q3.04 9.23 3.04 10.41L3.04 10.41L3.04 10.41Q3.04 11.59 3.52 12.15L3.52 12.15L3.52 12.15Q4.00 12.71 5.08 12.71L5.08 12.71L5.08 12.71Q5.73 12.71 6.22 12.25L6.22 12.25L6.22 12.25Q6.37 11.10 6.47 10.72L6.47 10.72L6.47 10.72Q6.71 9.80 7.20 9.80L7.20 9.80L7.20 9.80Q7.59 9.80 7.94 10.34L7.94 10.34L7.94 10.34Q8.29 10.88 8.27 11.26L8.27 11.26L8.27 11.26Q8.27 11.89 7.77 13.59L7.77 13.59L7.77 13.59Q8.75 12.85 10.02 11.40L10.02 11.40L10.02 11.40Q10.21 11.19 10.33 11.19L10.33 11.19L10.33 11.19Q10.53 11.19 10.53 11.65L10.53 11.65L10.53 11.65Q10.53 12.54 9.63 13.56L9.63 13.56L9.63 13.56Q8.74 14.57 7.25 15.18L7.25 15.18L7.25 15.18Q7.14 15.44 7.07 15.68L7.07 15.68L7.07 15.68Q7 15.92 6.89 16.25L6.89 16.25L6.89 16.25Q6.78 16.59 6.50 16.99L6.50 16.99L6.50 16.99Q6.22 17.39 5.80 17.67L5.80 17.67L5.80 17.67Q4.90 18.28 3.75 18.28L3.75 18.28L3.75 18.28Q2.59 18.28 1.81 17.77L1.81 17.77L1.81 17.77Q1.04 17.26 1.04 16.37L1.04 16.37L1.04 16.37Q1.04 15.93 1.46 15.65L1.46 15.65L1.46 15.65Q1.88 15.37 2.55 15.17L2.55 15.17L2.55 15.17Q3.22 14.97 4.06 14.81L4.06 14.81L4.06 14.81Q4.90 14.66 5.74 14.46L5.74 14.46L5.74 14.46Q5.85 14.14 5.91 13.86L5.91 13.86L5.91 13.86Q5.36 14.28 4.56 14.28L4.56 14.28L4.56 14.28Q2.90 14.28 1.95 13.59L1.95 13.59L1.95 13.59Q0.84 12.80 0.84 11.10L0.84 11.10L0.84 11.10Q0.84 8.89 1.96 6.90L1.96 6.90L1.96 6.90Q1.62 6.51 1.41 6.08L1.41 6.08L1.41 6.08Q1.20 5.66 1.20 5.43L1.20 5.43L1.20 5.43Q1.20 5.04 1.48 5.05L1.48 5.05L1.48 5.05Q1.67 5.05 1.90 5.28L1.90 5.28L1.90 5.28Q2.14 5.50 2.29 5.66L2.29 5.66L2.29 5.66Q2.44 5.81 2.60 5.94L2.60 5.94L2.60 5.94Q3.33 5.01 4.31 4.44L4.31 4.44L4.31 4.44Q5.29 3.86 6.47 3.86L6.47 3.86L6.47 3.86Q7.64 3.86 8.30 4.30L8.30 4.30L8.30 4.30Q8.96 4.73 8.96 5.81L8.96 5.81L8.96 5.81Q8.96 6.89 8.13 7.60L8.13 7.60L8.13 7.60Q7.29 8.32 5.81 8.32L5.81 8.32L5.81 8.32Q4.79 8.32 3.60 7.85ZM4.06 6.90L4.06 6.90L4.06 6.90Q4.83 7.24 5.92 7.24L5.92 7.24L5.92 7.24Q6.59 7.24 7 6.87L7 6.87L7 6.87Q7.41 6.51 7.41 6.08L7.41 6.08L7.41 6.08Q7.41 5.66 7.13 5.45L7.13 5.45L7.13 5.45Q6.86 5.25 6.41 5.25L6.41 5.25L6.41 5.25Q5.07 5.25 4.06 6.90ZM3.58 17.21L3.58 17.21L3.58 17.21Q4.54 17.21 5.25 15.78L5.25 15.78L5.25 15.78Q4.48 15.97 3.95 16.09L3.95 16.09L3.95 16.09Q3.42 16.20 3.09 16.28L3.09 16.28L3.09 16.28Q2.76 16.37 2.61 16.45L2.61 16.45L2.61 16.45Q2.46 16.53 2.46 16.69L2.46 16.69L2.46 16.69Q2.46 16.95 2.82 17.07L2.82 17.07L2.82 17.07Q3.18 17.19 3.58 17.21ZM11.51 14.49L11.51 14.49L11.51 14.49Q10.11 14.49 10.11 11.87L10.11 11.87L10.11 11.87Q10.11 10.44 10.46 9.28L10.46 9.28L10.46 9.28Q11.00 7.49 11.69 7.49L11.69 7.49L11.69 7.49Q12.10 7.49 12.33 8.04L12.33 8.04L12.33 8.04Q12.53 8.46 12.52 8.86L12.52 8.86L12.52 8.86Q12.52 9.42 12.18 10.84L12.18 10.84L12.18 10.84Q11.86 12.07 11.86 12.36L11.86 12.36L11.86 12.36Q11.86 12.66 12.00 12.77L12.00 12.77L12.00 12.77Q12.15 12.88 12.36 12.88L12.36 12.88L12.36 12.88Q12.56 12.88 12.87 12.61L12.87 12.61L12.87 12.61Q13.17 12.35 13.48 12.03L13.48 12.03L13.48 12.03Q13.79 11.72 14.05 11.45L14.05 11.45L14.05 11.45Q14.31 11.19 14.41 11.19L14.41 11.19L14.41 11.19Q14.60 11.19 14.60 11.66L14.60 11.66L14.60 11.66Q14.60 12.64 13.61 13.57L13.61 13.57L13.61 13.57Q12.63 14.50 11.51 14.49ZM12.08 6.36L12.08 6.36L12.08 6.36Q11.70 5.80 11.70 5.15L11.70 5.15L11.70 5.15Q11.70 4.51 11.91 4.08L11.91 4.08L11.91 4.08Q12.11 3.65 12.29 3.45L12.29 3.45L12.29 3.45Q12.47 3.25 12.71 3.25L12.71 3.25L12.71 3.25Q13.10 3.25 13.43 3.83L13.43 3.83L13.43 3.83Q13.75 4.41 13.75 4.80L13.75 4.80L13.75 4.80Q13.75 5.53 13.24 5.94L13.24 5.94L13.24 5.94Q12.73 6.36 12.08 6.36ZM14.52 13.69L14.52 13.69L14.52 13.69Q14.36 13.31 14.29 12.82L14.29 12.82L14.29 12.82Q14.22 12.32 14.22 11.42L14.22 11.42L14.22 11.42Q14.22 10.53 14.56 9.00L14.56 9.00L13.93 9.00L13.93 9.00Q13.76 9.00 13.76 8.86L13.76 8.86L13.76 8.86Q13.76 8.53 13.82 8.31L13.82 8.31L13.82 8.31Q13.89 8.09 14.13 7.81L14.13 7.81L14.46 7.81L14.46 7.81Q14.66 7.81 14.88 7.80L14.88 7.80L14.88 7.80Q15.55 5.64 16.25 5.64L16.25 5.64L16.25 5.64Q16.81 5.66 17.04 6.36L17.04 6.36L17.04 6.36Q17.09 6.55 17.16 6.78L17.16 6.78L16.59 7.78L16.59 7.78Q17.57 7.81 17.83 7.81L17.83 7.81L17.83 7.81Q18.09 7.81 18.11 7.86L18.11 7.86L18.11 7.86Q18.13 7.91 18.13 8.01L18.13 8.01L18.13 8.01Q18.13 8.26 18.01 8.64L18.01 8.64L18.01 8.64Q17.89 9.02 17.74 9.00L17.74 9.00L16.34 8.93L16.34 8.93Q16.04 10.64 16.04 11.76L16.04 11.76L16.04 11.76Q16.04 12.88 16.37 12.88L16.37 12.88L16.37 12.88Q16.63 12.88 17.33 12.44L17.33 12.44L17.33 12.44Q18.03 12.00 18.34 11.59L18.34 11.59L18.34 11.59Q18.65 11.19 18.84 11.19L18.84 11.19L18.84 11.19Q19.04 11.19 19.04 11.66L19.04 11.66L19.04 11.66Q19.04 12.14 18.70 12.63L18.70 12.63L18.70 12.63Q18.37 13.13 17.86 13.54L17.86 13.54L17.86 13.54Q17.35 13.96 16.72 14.22L16.72 14.22L16.72 14.22Q16.10 14.49 15.64 14.49L15.64 14.49L15.64 14.49Q15.18 14.49 14.93 14.27L14.93 14.27L14.93 14.27Q14.69 14.06 14.52 13.69ZM19.46 13.92L19.46 13.92Q19.74 13.20 20.30 12.73L20.30 12.73L20.30 12.73Q20.86 12.26 21.52 12.26L21.52 12.26L21.52 12.26Q22.18 12.26 22.18 12.99L22.18 12.99L22.18 12.99Q22.18 13.72 21.71 14.29L21.71 14.29L21.71 14.29Q21.24 14.87 20.76 14.85L20.76 14.85L20.76 14.85Q19.92 14.85 19.46 13.92L19.46 13.92ZM24.65 5.74L24.65 5.74L24.65 5.74Q24.49 5.87 24.32 5.98L24.32 5.98L24.32 5.98Q24.15 6.09 23.93 6.09L23.93 6.09L23.93 6.09Q23.72 6.09 23.72 5.71L23.72 5.71L23.72 5.71Q23.72 4.94 24.43 4.45L24.43 4.45L24.43 4.45Q25.12 3.95 26.08 3.95L26.08 3.95L26.08 3.95Q27.05 3.95 27.50 4.63L27.50 4.63L27.50 4.63Q27.86 5.18 27.86 6.12L27.86 6.12L27.86 6.12Q27.86 6.52 27.71 7.17L27.71 7.17L27.71 7.17Q26.91 10.50 26.89 11.79L26.89 11.79L26.89 11.79Q26.91 12.40 27.41 12.63L27.41 12.63L27.41 12.63Q27.61 12.71 27.87 12.71L27.87 12.71L27.87 12.71Q29.12 12.71 30.23 11.24L30.23 11.24L30.23 11.24Q29.67 9.28 29.67 6.79L29.67 6.79L29.67 6.79Q29.67 5.87 30.11 5.29L30.11 5.29L30.11 5.29Q30.55 4.70 31.54 4.70L31.54 4.70L31.54 4.70Q32.28 4.70 32.67 5.12L32.67 5.12L32.67 5.12Q33.05 5.54 33.05 6.23L33.05 6.23L33.05 6.23Q33.05 7.64 32.31 9.72L32.31 9.72L32.31 9.72Q32.06 10.42 31.72 11.10L31.72 11.10L31.72 11.10Q32.33 12.73 33.32 12.73L33.32 12.73L33.32 12.73Q34.44 12.73 35.28 11.21L35.28 11.21L35.28 11.21Q35.90 10.11 36.29 8.20L36.29 8.20L36.29 8.20Q35.27 8.06 34.67 7.34L34.67 7.34L34.67 7.34Q34.08 6.61 34.08 5.78L34.08 5.78L34.08 5.78Q34.08 4.96 34.59 4.41L34.59 4.41L34.59 4.41Q35.11 3.86 36.01 3.86L36.01 3.86L36.01 3.86Q36.90 3.85 37.35 4.49L37.35 4.49L37.35 4.49Q37.80 5.12 37.80 6.22L37.80 6.22L37.80 6.50L37.80 6.50Q37.80 6.65 37.79 6.83L37.79 6.83L37.79 6.83Q38.02 6.72 38.19 6.60L38.19 6.60L38.19 6.60Q38.36 6.48 38.53 6.48L38.53 6.48L38.53 6.48Q38.81 6.48 38.81 6.72L38.81 6.72L38.81 6.72Q38.81 7.18 38.51 7.53L38.51 7.53L38.51 7.53Q38.21 7.88 37.70 8.06L37.70 8.06L37.70 8.06Q37.52 9.70 37.21 10.64L37.21 10.64L37.21 10.64Q36.64 12.45 35.70 13.38L35.70 13.38L35.70 13.38Q34.58 14.48 32.94 14.49L32.94 14.49L32.94 14.49Q31.58 14.49 30.73 12.68L30.73 12.68L30.73 12.68Q29.30 14.49 27.48 14.49L27.48 14.49L27.48 14.49Q26.24 14.49 25.50 13.87L25.50 13.87L25.50 13.87Q24.77 13.24 24.77 11.90L24.77 11.90L24.77 11.90Q24.77 11.58 25.12 10.20L25.12 10.20L25.12 10.20Q25.48 8.82 25.69 7.93L25.69 7.93L25.69 7.93Q25.90 7.04 25.90 6.52L25.90 6.52L25.90 6.52Q25.90 5.39 25.33 5.39L25.33 5.39L25.33 5.39Q25.13 5.39 24.97 5.50L24.97 5.50L24.97 5.50Q24.81 5.61 24.65 5.74ZM31.43 5.88L31.43 5.88L31.43 5.88Q31.07 5.88 31.07 7.01L31.07 7.01L31.07 7.01Q31.07 8.15 31.26 9.30L31.26 9.30L31.26 9.30Q31.79 7.91 31.79 6.61L31.79 6.61L31.79 6.61Q31.79 6.33 31.70 6.10L31.70 6.10L31.70 6.10Q31.61 5.88 31.43 5.88ZM36.16 5.08L36.16 5.08L36.16 5.08Q35.87 5.08 35.87 5.54L35.87 5.54L35.87 5.54Q35.87 6.38 36.53 6.76L36.53 6.76L36.53 6.76Q36.58 6.23 36.58 6.05L36.58 6.05L36.58 6.05Q36.58 5.66 36.48 5.42L36.48 5.42L36.48 5.42Q36.37 5.08 36.16 5.08ZM42.60 13.83L42.60 13.83L42.60 13.83Q42.60 14.66 40.99 14.66L40.99 14.66L40.99 14.66Q40.64 14.66 40.58 14.30L40.58 14.30L40.58 14.30Q40.52 13.94 40.52 13.41L40.52 13.41L40.52 13.41Q40.52 12.88 40.59 12.27L40.59 12.27L40.59 12.27Q40.67 11.66 40.80 10.95L40.80 10.95L40.80 10.95Q41.03 9.58 41.47 7.99L41.47 7.99L41.47 7.99Q41.92 6.40 42.35 5.53L42.35 5.53L42.35 5.53Q41.47 5.59 40.60 5.85L40.60 5.85L40.60 5.85Q39.73 6.10 39.37 6.21L39.37 6.21L39.37 6.21Q39.00 6.31 38.77 6.31L38.77 6.31L38.77 6.31Q38.53 6.31 38.53 6.16L38.53 6.16L38.53 6.16Q38.53 5.98 38.81 5.62L38.81 5.62L38.81 5.62Q39.09 5.26 39.61 4.90L39.61 4.90L39.61 4.90Q40.92 4.00 42.53 3.99L42.53 3.99L47.14 4.03L47.14 4.03Q47.52 4.03 47.52 4.33L47.52 4.33L47.52 4.33Q47.52 4.41 47.40 4.63L47.40 4.63L47.40 4.63Q47.29 4.84 47.21 5.10L47.21 5.10L47.21 5.10Q47.03 5.60 46.44 5.60L46.44 5.60L46.44 5.60Q45.86 5.60 43.68 5.52L43.68 5.52L43.68 5.52Q43.62 6.13 43.46 7.09L43.46 7.09L43.46 7.09Q43.29 8.05 43.09 9.18L43.09 9.18L43.09 9.18Q42.62 12.08 42.60 13.83ZM48.44 9.84L48.44 9.84L48.44 9.84Q47.63 9.95 47.10 9.95L47.10 9.95L47.10 9.95Q46.91 9.95 46.91 9.81L46.91 9.81L46.91 9.81Q46.91 9.49 47.36 9.14L47.36 9.14L47.36 9.14Q47.80 8.78 48.79 8.51L48.79 8.51L48.79 8.51Q49.24 6.92 49.81 5.59L49.81 5.59L49.81 5.59Q48.41 5.66 47.52 6.51L47.52 6.51L47.52 6.51Q47.29 6.73 47.15 6.86L47.15 6.86L47.15 6.86Q47.01 6.99 46.91 6.99L46.91 6.99L46.91 6.99Q46.80 6.99 46.70 6.82L46.70 6.82L46.70 6.82Q46.61 6.65 46.61 6.37L46.61 6.37L46.61 6.37Q46.62 5.29 48.06 4.62L48.06 4.62L48.06 4.62Q49.50 3.95 51.62 3.96L51.62 3.96L55.82 4.03L55.82 4.03Q56.20 4.03 56.20 4.33L56.20 4.33L56.20 4.33Q56.20 4.41 56.08 4.63L56.08 4.63L56.08 4.63Q55.97 4.84 55.89 5.10L55.89 5.10L55.89 5.10Q55.71 5.60 55.10 5.60L55.10 5.60L54.66 5.60L52.79 5.59L51.72 5.59L51.72 5.59Q51.60 6.38 51.04 8.19L51.04 8.19L53.61 8.23L53.61 8.23Q53.83 8.23 53.83 8.50L53.83 8.50L53.83 8.50Q53.83 8.58 53.76 8.79L53.76 8.79L53.76 8.79Q53.69 9.00 53.63 9.23L53.63 9.23L53.63 9.23Q53.52 9.69 53.16 9.69L53.16 9.69L51.03 9.59L50.85 9.59L50.85 9.59Q50.76 9.59 50.65 9.60L50.65 9.60L50.65 9.60Q49.92 12.28 49.92 13.83L49.92 13.83L49.92 13.83Q49.92 14.66 48.31 14.66L48.31 14.66L48.31 14.66Q47.96 14.66 47.90 14.30L47.90 14.30L47.90 14.30Q47.84 13.94 47.84 13.36L47.84 13.36L47.84 13.36Q47.84 12.10 48.44 9.84Z"></path></g><!----><!----></svg>
                    <span class="w-12 mr-1 hidden">@include('layouts/partials/logo')</span>
                </a>

                <div class="pt-2 mr-4 md:ml-8 flex flex-grow hidden md:block relative">
                    <div class="absolute mt-3 ml-4 text-gray-600 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.33 13.33" class="fill-current w-4 text-solstice-blue-opacity-60">
                            <path d="M13.14 12.19l-2.46-2.45a6 6 0 1 0-.94.94l2.45 2.46a.7.7 0 0 0 .48.19.66.66 0 0 0 .47-.19.68.68 0 0 0 0-.95zM1.33 6a4.67 4.67 0 1 1 8 3.29 4.67 4.67 0 0 1-8-3.29z"></path>
                        </svg>
                    </div>
                    <my-search></my-search>
                </div>

                <div class="flex pl-6 pr-0 md:pr-8">
                    <a href="https://github.com/{{ config('me.social.github') }}" target="_blank" rel="noopener" data-turbolinks="false" class="no-underline pl-2 sm:pl-2 sm:pr-2 pt-3 md:pt-4 text-red-300 hover:text-white mr-2 md:mr-2">
                        <span class="hidden font-medium inline-block mb-3 mr-1 align-middle">Github</span> {{ svg('github-alt') }}
                    </a>
                    <a href="https://twitter.com/{{ config('me.social.twitter') }}" target="_blank" rel="noopener" data-turbolinks="false" class="no-underline pl-2 sm:pl-2 sm:pr-2 pt-3 md:pt-4 text-red-300 hover:text-white">
                        <span class="hidden font-medium inline-block mb-3 mr-1 align-middle">Twitter</span> {{ svg('twitter-alt') }}
                    </a>
                </div>

                <div class="hidden md:flex">
                    <a href="https://github.com/meSingh/git.wtf/issues/new?assignees=&labels=solution+needed&template=article-request.md&title=%5BARTICLE_REQUEST%5D+" target="_blank" rel="noopener" class="pl-2 sm:px-3 py-0 flex-none flex items-center no-underline text-white leading-tight hover:bg-white hover:text-red-600 mt-2 font-bold border-2 border-solid hover:border-white">
                        <span class="font-semibold">Request a solution</span>
                    </a>
                    <a href="mailto:{{ config('me.email') }}?Subject=GITWTF: Post Submission" target="_blank" rel="noopener" class="pl-2 sm:px-3 py-0 flex-none flex items-center no-underline text-white leading-tight hover:bg-white hover:text-red-600 mt-2 font-bold border-2 border-l-0 border-solid hover:border-white">
                        <span class="font-semibold">Submit a solution</span>
                    </a>
                </div>
            </div>
            <div class=" md:hidden">
                <div class="w-full px-4 pt-2 pb-2 relative">
                    <div class="absolute mt-3 ml-4 text-gray-600 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.33 13.33" class="fill-current w-4 text-solstice-blue-opacity-60">
                            <path d="M13.14 12.19l-2.46-2.45a6 6 0 1 0-.94.94l2.45 2.46a.7.7 0 0 0 .48.19.66.66 0 0 0 .47-.19.68.68 0 0 0 0-.95zM1.33 6a4.67 4.67 0 1 1 8 3.29 4.67 4.67 0 0 1-8-3.29z"></path>
                        </svg>
                    </div>
                    <my-search></my-search>
                </div>
                <div class="flex px-4 pb-4 justify-center">
                    <a href="https://github.com/meSingh/git.wtf/issues/new?assignees=&labels=solution+needed&template=article-request.md&title=%5BARTICLE_REQUEST%5D+" target="_blank" rel="noopener" class="px-3 py-2 flex items-center no-underline text-white leading-tight hover:bg-white hover:text-red-600 mt-2 font-bold border-2 border-solid hover:border-white">
                        <span class="font-semibold">Request a solution</span>
                    </a>
                    <a href="mailto:{{ config('me.email') }}?Subject=GITWTF: Post Submission" target="_blank" rel="noopener" class="px-3 py-2 flex items-center no-underline text-white leading-tight hover:bg-white hover:text-red-600 mt-2 font-bold border-2 border-l-0 border-solid hover:border-white">
                        <span class="font-semibold">Submit a solution</span>
                    </a>
                </div>
            </div>
        </header>

        <section class="bg-white">
            @yield('content')
        </section>



        @include('layouts.partials.footer')
    </div>

    <script>
        var ALGOLIA_INSIGHTS_SRC = "https://cdn.jsdelivr.net/npm/search-insights@1.1.1";

        !function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e.aa=e.aa||function(){
        (e.aa.queue=e.aa.queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)[0],
        i.async=1,i.src=ALGOLIA_INSIGHTS_SRC,c.parentNode.insertBefore(i,c)
        }(window,document,"script",0,"aa");

        aa('init', {
            appId: '{{ env("MIX_ALGOLIA_APP_ID")}}',
            apiKey: '{{ env("MIX_ALGOLIA_SEARCH")}}',
        });
    </script>

    @if(app()->environment('production'))
    <script type="text/javascript" src="https://cdn.howuku.com/js/howu.js" key="N6V9xer17B7rVROvGQJ53g"></script>
    <script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js" data-cfasync="false"></script>
    <script>
        window.cookieconsent.initialise({
            "palette": {
                "popup": {
                    "background": "#f8f8f8",
                    "text": "#333333"
                },
                "button": {
                    "background": "#e84545"
                }
            },
            "showLink": false,
            "theme": "edgeless",
            "position": "bottom-left"
        });
    </script>
    @endif

    @yield('javascript')
</body>

</html>
