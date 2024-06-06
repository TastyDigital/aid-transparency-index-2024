<?php
	if(!empty($_GET['code'])){
		//write_log('code raw: '.$_GET['code']);
		$code = filter_var ( trim($_GET['code']), FILTER_SANITIZE_STRING);
		//write_log('code filtered: '.$code);

		if(!empty($code)) {

			$donorData = array();
			$str = file_get_contents('../../widget/src/data/results_2024.json');
			if($str){
				$json = json_decode($str, true);
				if(!empty($json[$code])){
					$donorData = $json[$code];
					$donorData['position'] = $donorData['rank'].'/'.count($json);
				}
			}
			if(!empty($donorData)){

				// load wordpress functions and tidy WP output
				if(file_exists( rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp-load.php' )) {
					include_once rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp-load.php';
				}
				else if(file_exists( rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp/wp-load.php' )){
					include_once rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/wp/wp-load.php';
				}
				remove_action('wp_footer', 'EUCLC_cookieMessage');
				remove_action('wp_footer', 'SCCM_cookieMessage');
				function tasty_remove_scripts_styles() {
					// remove all loaded Scripts and styles
					global $wp_scripts;
					foreach( $wp_scripts->queue as $script ) :
						wp_dequeue_script($wp_scripts->registered[$script]->handle);
					endforeach;

					global $wp_styles;
					foreach( $wp_styles->queue as $style ) :
						wp_dequeue_style($wp_styles->registered[$style]->handle);
					endforeach;

					wp_enqueue_script( 'aid-transparency-index-2024', plugin_dir_url( dirname(__DIR__) ) . 'public/dist/aid-transparency-index-public.min.js', array(
						'jquery'
					), filemtime( plugin_dir_path( dirname(__DIR__) ) . 'public/dist/aid-transparency-index-public.js' ), true );

				}
				add_action( 'wp_enqueue_scripts', 'tasty_remove_scripts_styles', 100 );

				$colours = array();
				$paletteFile = file_get_contents('../../widget/src/swatches/palette.js'); // imports palette json
				$paletteFile = strstr($paletteFile, '[');
				$paletteFile = str_replace(';','',$paletteFile);
				if($paletteFile){
					$paletteJson = json_decode($paletteFile, true);
					write_log($paletteJson);
					$categories = [
						0 => "Very good",
						1 => "Good",
						2 => "Fair",
						3 => "Poor",
						4 => "Very poor"
					];
					foreach ($paletteJson as $k => $colourGroup){
						foreach ($colourGroup['entries'] as $i => $shade) {
							$colours[ $categories[ $k ] ][$i] = '#'.$shade['color']['hex'];
						}
					}
				}
				$donorColours = $colours[ucfirst(strtolower($donorData['performance_group']))];
				write_log($donorColours);
				do_action( 'wp_head' );
				write_log(plugins_url( 'widget/src/data/results_2024.json', dirname(__DIR__)  ));
				echo '<canvas id="donor-graphic" width="1200" height="900" data-code="'.strtolower($code).'" data-colours="'.$donorColours[2].','.$donorColours[0].'" data-path="'.plugins_url( 'widget/src/data/results_2024.json', dirname(__DIR__)  ).'"></canvas>';
				do_action( 'wp_footer' );
			}else{
				http_response_code(404);
			}

		}else{
			http_response_code(404);
		}


	}else{
		http_response_code(404);
	}
