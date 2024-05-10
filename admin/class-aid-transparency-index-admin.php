<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://tastydigital.com
 * @since      1.0.0
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/admin
 */
use mikehaertl\wkhtmlto\Pdf;
use mikehaertl\wkhtmlto\Image;
/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/admin
 * @author     Tasty Digital Ltd <developers@tastydigital.com>
 */
class Aid_Transparency_Index_2024_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Aid_Transparency_Index_2022_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Aid_Transparency_Index_2022_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/aid-transparency-index-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Aid_Transparency_Index_2022_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Aid_Transparency_Index_2022_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/aid-transparency-index-admin.js', array( 'jquery' ), $this->version, false );

	}
	private function getDonorFilename($post_id) {

		$code = get_post_meta( $post_id, 'ati_donor_meta_2024_code', true );
		$code = str_replace(' ', '-', strtolower($code));
		$code = str_replace(array(',','*','(',')','/','.'), '', $code);
		return $code;
	}
	// return array
	private function getDonorUploadLocation($year, $subfolder) {
		// return array
		$upload_dir = wp_upload_dir();
		$dir = $upload_dir['basedir'].'/ati/';
		// build folder structure if not exists
		if(!is_dir($dir)){
			mkdir($dir, 0755);
		}
		$path = $dir . $year.'/';
		if(!is_dir($path)){
			mkdir($path, 0755);
		}
		$url = $upload_dir['baseurl'] . '/ati/' . $year .'/';
		if(isset($subfolder)){
			$path = $path . $subfolder .'/';
			if(!is_dir($path)){
				mkdir($path, 0755);
			}
			$url .= $subfolder .'/';
		}

		return [
			'path' => $path,
			'url' => $url
		];
	}
	public function save_donor_pdf($post_id) {
		// Donor post has been saved
		// lets create or update existing PDF and attach it to posts and download monitor
		$donor = get_post($post_id);
		if($donor->post_status === 'publish' && $donor->post_type === 'donor_2024'){
			// cmb2 field for download.
			//$pdf = new Pdf(get_permalink($post_id));
			$code = $this->getDonorFilename( $post_id );
			$lang = get_post_meta( $post_id, 'ati_page_2024_meta_language', true );
			$year = 2024;


			// $filename = $code.'_'.$post_id.'_'.$version . '_' . $lang .'.pdf';
			$filename = $code.'_'.$post_id.'_'. $lang .'.pdf'; // we only need one version of this pdf that’s current..



			$fileLocation = $this->getDonorUploadLocation($year,'pdf'); // year could be $theme var in JS...


			$options = array(
				'user-style-sheet' => plugin_dir_path( __FILE__ ) .'css/pdf.css',
			);
			$pdf = new Pdf($options);
			$pdf->addPage(get_permalink($post_id));
			//$pdf->setOptions($options);
			if (!$pdf->saveAs($fileLocation['path'].$filename )) {
				$error = $pdf->getError();
				write_log('pdf writing error:');
				write_log($error);
				return;
			}

			// attach pdf to post
			$filetype = wp_check_filetype( basename( $filename ), null );
			$url = $fileLocation['url'] . $filename;

			/** @var DLM_File_Manager $file_manager */
			$file_manager = download_monitor()->service( 'file_manager' );
			$file_size = $file_manager->get_file_size( $url );

			$attachment = array(
				'guid'           => $url,
				'post_mime_type' => $filetype['type'],
				'post_title'     => sanitize_file_name($donor->post_title . ' ' . $lang),
				'post_content'   => '',
				'post_status'    => 'inherit'
			);
			//write_log('Attachment URL: '.$url);
			//write_log($upload_dir);
			$prev_attachment_pdf = attachment_url_to_postid($url);
			if($prev_attachment_pdf > 0){
				//write_log('Attachment ID exists: '.$prev_attachment_pdf);
				$attachment['ID'] = $prev_attachment_pdf;
			}

			$attachment_id = wp_insert_attachment( $attachment, $fileLocation['path'].$filename, $post_id );


			if ( defined( 'DLM_VERSION' ) ) {
//				// download monitor installed,  lets insert pdf and attach to donor post
//				write_log('Download monitor installed');
//				write_log($path.$filename);

				try {

					$prev_download_id = get_post_meta( $post_id, 'ati_page_2024_meta_pdf_download_id_'.$year, true );

					//write_log('$prev_download_id: ' . $prev_download_id);

					$prev_download = get_post($prev_download_id );

					$download = false;
					/** @var DLM_Download $download */
					if( $prev_download->post_type === 'dlm_download' && $prev_download->post_status !== 'trash' ){
						// updates instead of insert..
						// retrieve download with same ID
						try {
							// write_log('retrieving single download with prev download id '.$prev_download_id);
							$download = download_monitor()->service( 'download_repository' )->retrieve_single( $prev_download_id );
						} catch ( Exception $exception ) {
							write_log('failed to retrieve prev download');
							// maybe download repo has been deleted...
						}

					}

					if(!$download){
						//write_log('Creating new download');
						$download = new DLM_Download();
						// set the 'Download Options'
						$download->set_featured( false );
						$download->set_members_only( false );
						$download->set_redirect_only( true );
					}

					$download->set_title( $donor->post_title . ' ' . $year . ' (' .$lang .')' );
					$download->set_author( get_current_user_id() );
					$download->set_status( "publish" );

					download_monitor()->service( 'download_repository' )->persist( $download );

					//write_log( $download );
					if ( $download->exists() ) {

						$download_id = $download->get_id();
						//write_log('$download_id: '.$download_id);
						if( $prev_download_id !== $download_id ) {
							//write_log('UPDATING ati_page_2024_meta_pdf_download_id_2024 meta: '. $post_id . ' ati_page_2024_meta_pdf_download_id_' . $year . ' ' . $download_id . ' ' . $prev_download_id);
							update_post_meta( $post_id, 'ati_page_2024_meta_pdf_download_id_' . $year, $download_id );
						}

						$versions = $download->get_versions();


						$is_version = false;
//						write_log('versions : ');
//						write_log($versions);
						if ( count($versions) > 0 ) {
							// write_log('version count : '.count($versions));
							/** @var DLM_Download_Version $version */
							foreach ( $versions as $version ) {
								$mirrors = $version->get_mirrors();
								foreach ( $mirrors as $mirror ) {
//									write_log('mirror: '.$mirror);
									if($mirror === $url){
//										write_log('mirror matched to url: '.$url);
										$is_version = $version->get_id();
										continue;
									}
								}
							}

							if(!empty($is_version)){

								// write_log('$is_version not empty: '.$is_version);
								try {
									// retrieve version with ID 91
									/** @var DLM_Download_Version $version */
									$this_version = download_monitor()->service( 'version_repository' )->retrieve_single( $is_version );
									$this_version->set_version( intval($this_version->get_version()) + 1 );
									$this_version->set_author( get_current_user_id() );
									$this_version->set_date( new DateTime( current_time( 'mysql' ) ) );
									$this_version->set_filesize( $file_size );
									// persist version
									download_monitor()->service( 'version_repository' )->persist( $this_version );


								} catch ( Exception $exception ) {
									//write_log('version with ID '.$is_version.' not retrieved');
									$is_version = false;
								}
							}

						}

						if( empty($is_version) ){
							//write_log('$is_version is empty');
							//write_log('creating new version and adding to download ' . $download_id);
							$this_version = new DLM_Download_Version();
							$this_version->set_download_id( $download_id );
							$this_version->set_mirrors( array($url) );
							$this_version->set_version( 0);

							$this_version->set_author( get_current_user_id() );
							$this_version->set_date( new DateTime( current_time( 'mysql' ) ) );
							$this_version->set_filesize( $file_size );
							// persist version
							download_monitor()->service( 'version_repository' )->persist( $this_version );
//							write_log('new version: '. $this_version->get_id());
//							write_log('mirrors');
//							write_log(array($url));
						}

						download_monitor()->service( 'transient_manager' )->clear_versions_transient( $download_id );



					} else {
						throw new Exception( __( 'Error: Download was not created.', 'aid-transparency-index-2024' ) );
					}

				} catch ( Exception $e ) {
					//echo '<div class="error"><p>' . $e->getMessage() . "</p></div>";
					write_log( $e->getMessage());
				}



			}



		}

	}
	public function save_donor_thumbnail($post_id) {
		// only run if no thumbnail assigned
		if ( ! has_post_thumbnail($post_id) ) {
			$year = 2024;
			// no featured image, see if we can attache one.
			$code = $this->getDonorFilename( $post_id );
			$imgName = $code.'.png';
			$imgLocation = $this->getDonorUploadLocation($year, 'img');

			//write_log('thumbnail path: '.$imgLocation['path'].$imgName);

			if( !file_exists($imgLocation['path'].$imgName) ){
				// lets attach file to post automagically
				// write_log($imgLocation['path'].$imgName . ' image file doesn’t exist yet, generating one');



				$donorcode = get_post_meta( get_the_ID(), 'ati_donor_meta_2024_code', true );
				$machinecode = str_replace(' ', '-', strtolower($donorcode));
				$machinecode = str_replace(array(' ',',','.'), '', $machinecode);
				$imgpage = plugin_dir_url( __FILE__ ) . 'partials/donor-graph-image.php?code='.urlencode($machinecode);
				//write_log('$imgpage: '. $imgpage);
				$image = new Image($imgpage);

				if (!$image->saveAs($imgLocation['path'].$imgName )) {
					$error = $image->getError();
					write_log('Image writing error:');
					write_log($error);
					return;
				}
			}

			if( file_is_displayable_image($imgLocation['path'].$imgName )) {
				// can be hotwired with 'file_is_displayable_image' filter
				//  lets attach image
				//write_log($imgLocation['path'].$imgName . ' is displayable image, attaching as thumbnail');
				// attach pdf to post
				$imgtype = wp_check_filetype( basename( $imgName ), null );
				$url = $imgLocation['url'] . $imgName;
				$donor = get_post($post_id);
				$attachment = array(
					'guid'           => $url,
					'post_mime_type' => $imgtype['type'],
					'post_title'     => sanitize_file_name($donor->post_title . ' ' . $year),
					'post_content'   => '',
					'post_status'    => 'inherit'
				);
				$prev_attachment_img = attachment_url_to_postid($url);
				if($prev_attachment_img > 0){
					//write_log('Attachment ID exists: '.$prev_attachment_pdf);
					$attachment['ID'] = $prev_attachment_img;
				}

				$attachment_id = wp_insert_attachment( $attachment, $imgLocation['path'].$imgName, $post_id );
				require_once( ABSPATH . 'wp-admin/includes/image.php' );
				$attach_data = wp_generate_attachment_metadata( $attachment_id, $imgLocation['path'].$imgName );

				$res1= wp_update_attachment_metadata( $attachment_id, $attach_data );
				$res2= set_post_thumbnail( $post_id, $attachment_id );


			}else{
				write_log('ATI Error: ' . $imgLocation['path'].$imgName . ' is not displayable image!');
			}

		}
	}
}
