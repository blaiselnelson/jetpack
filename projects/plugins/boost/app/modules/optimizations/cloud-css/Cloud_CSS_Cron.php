<?php

namespace Automattic\Jetpack_Boost\Modules\Optimizations\Cloud_CSS;

use Automattic\Jetpack_Boost\Lib\Critical_CSS\Critical_CSS_State;

class Cloud_CSS_Cron {

	const SCHEDULER_HOOK = 'jetpack_boost_check_cloud_css';

	/**
	 * Initiate the scheduler
	 *
	 * Whenever Cloud CSS module is setup, it will call this method.
	 *
	 * @return void
	 */
	public static function init() {
		/*
		 * Run the scheduled job
		 */
		add_action( self::SCHEDULER_HOOK, array( self::class, 'run' ) );
	}

	/**
	 * Run the cron job.
	 */
	public static function run() {
		$state = new Critical_CSS_State();

		if ( $state->has_errors() ) {
			$client = new Cloud_CSS_Request();
			$client->request_generate();
		}
	}

	/**
	 * Add a cron-job to maintain cloud CSS
	 *
	 * @param int $when Timestamp of when to schedule the event.
	 *
	 * @return void
	 */
	public static function install( $when ) {
		// Remove any existing schedule
		self::uninstall();

		wp_schedule_single_event( $when, self::SCHEDULER_HOOK );
	}

	/**
	 * Remove the cron-job
	 */
	public static function uninstall() {
		wp_clear_scheduled_hook( self::SCHEDULER_HOOK );
	}
}
